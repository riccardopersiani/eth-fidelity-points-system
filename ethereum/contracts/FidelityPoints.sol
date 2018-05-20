pragma solidity ^0.4.21;


library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}


interface IERC20 {
    function totalSupply() public constant returns (uint256 totalSupply);
    function balanceOf(address _owner) public constant returns (uint256 balance);
    function transfer(address _to, uint256 _value) public returns (bool success);
    //function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    //function allowance(address _owner, address _spender) public constant returns (uint256 remaining);
    //function approve(address _spender, uint256 _value) public returns (bool success);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    //event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}


contract Owned {
    address public owner;

    function Owned() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}


contract FidelityPoints is IERC20, Owned {
    // Overlay of the Safemath library on uint256 datatype
    using SafeMath for uint256;

    // Restrinct the usage of a function to a shop
    modifier onlyShop {
        require(containsShop(msg.sender));
        _;
    }

    // Structure of a payment request done by a shop asking money from the ISP
    struct EthereumPaymentRequest {
        address shop;
        string note;
        string method;
        uint value;
        string shopId;
        bool completed;
    }

    // Structure of a buy request done by a user for buying a product from a shop
    struct BuyingRequest {
        address user;
        address shop;
        string product;
        string shopName;
        string userId;
        uint value;
        bool shipped;
    }

    // Contract variables
    uint public constant INITIAL_SUPPLY =  1000000000000;                // Initial supply of tokens: 1.000.000.000.000
    uint public _totalSupply =  0;                                      // Total amount of tokens
    address public owner;                                               // Address of the contract owner
    address[] public shops;                                             // Array of shop addresses
    EthereumPaymentRequest[] public ethereumPaymentRequests;            // Array of shop payment requests
    BuyingRequest[] public buyingRequests;                              // Array of user buy requests

    // Cryptocurrency characteristics
    string public constant symbol = "FID";                              // Cryprocurrency symbol
    string public constant name = "Fido Coin";                          // Cryptocurrency name
    uint8 public constant decimals = 18;                                // Standard number for Eth Token
    uint256 public constant RATE = 1000000000000000000;                 // 1 ETH = 10^18 FID;

    // Map definions
    mapping (address => uint256) public balances;                       // Map [User,Amount]
    mapping (address => bool) public shopsMap;                          // Map [Shop,Official]
    mapping (address => mapping (address => uint256)) public allowed;   // Map [User,[OtherUser,Amount]]

    // Events definition
    // This notify clients about the transfer
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    // This notifies clients about approvation
    //event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    // This notifies clients about the account freezing
    // event FrozenFunds(address target, bool frozen);
    // This notifies clients about the amount burnt
    // event Burn(address indexed _from, uint256 _value);

    // Constructor, set the contract sender/deployer as owner
    function FidelityPoints() public {
        require(msg.sender != 0x00);
        _totalSupply = INITIAL_SUPPLY * 10 ** uint256(decimals); //update total supply with decimal
        balances[msg.sender] = _totalSupply;
        owner = msg.sender;
    }

    /******************************************************************************
     * Fallback function, a function with no name that gets called                *
     * whenever you do not actually pass a function name.                         *
     * This allow people to just send money directly to the contract address.     *
     ******************************************************************************/
    function () public payable {
        // People will send money directly to the contract address
    }

    /*****************************************************************************
    * Check if a shop exists                                                     *
    ******************************************************************************/
    function containsShop(address _shop) public view returns (bool) {
        return shopsMap[_shop];
    }

    /*****************************************************************************
    * Perform a FIDO token generation                                            *
    ******************************************************************************/
    function createTokens() public payable onlyOwner {
        // Check if the amount trasfered is greather than 0
        require(msg.value > 0);
        require(msg.sender != 0x00);
        // Create Fidelity Points from Ether
        uint256 tokens = msg.value.mul(RATE); // moltiplica per 10^18
        // Add fidelity points to the buyer account
        balances[msg.sender] = balances[msg.sender].add(tokens);
        // Total supply number increased by the new token creation
        _totalSupply = _totalSupply.add(tokens);
        // Rollback auto if transaction fail.
        owner.transfer(msg.value);
    }

    /*****************************************************************************
    * Perform a payment with the ETH cryptocurrency                              *
    *                                                                            *
    * Return true if success                                                     *
    *                                                                            *
    * @param _to the address of the receiver                                     *
    * @param _value amount of ETH transfered                                     *
    ******************************************************************************/
    function payWithEthereum(address _to, uint256 _value) public payable onlyOwner returns (bool success) {
        // Check if the amount trasfered is greather than 0.
        require(msg.value > 0);
        // Check if the sender is differrent from 0x00.
        require(msg.sender != 0x00);
        // Transfer Operation.
        _to.transfer(_value);
        return true;
    }

    /*****************************************************************************
    * Return the total supply of the token.                                      *
    *                                                                            *
    *                                                                            *
    * Return the value of the variable `_totalSupply`                            *
    ******************************************************************************/
    function totalSupply() public constant returns (uint256 totalSupply) {
        // Value of the contract variable
        return _totalSupply;
    }

    /*****************************************************************************
    * Return the balance of an account.                                          *
    *                                                                            *
    * Return the amount of money of the `_account`.                              *
    *                                                                            *
    * @param _account the address of the account of which I want the balance     *
    ******************************************************************************/
    function balanceOf(address _account) public constant returns (uint256 balance) {
        return balances[_account];
    }

    /*****************************************************************************
    * Transfer tokens from sender to receiver.                                   *
    *                                                                            *
    * Send `_value` tokens from the msg.sender to the `_to` address.             *
    *                                                                            *
    * @param _to the address of the receiver.                                    *
    * @param _value the amount of points to send.                                *
    ******************************************************************************/
    function transfer(address _to, uint256 _value) public returns (bool success) {
        _value = _value * 10 ** uint256(decimals);
        // Check if the sender has enough
        require(balances[msg.sender] >= _value);
        // Check if the amount trasfered is greather than 0
        require(_value > 0);
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != 0x0);
        // Check for overflows
        require(balances[_to] + _value > balances[_to]);
        // Check for underflows ?
        require(balances[msg.sender] - _value < balances[msg.sender]);
        // Save for the future assertion
        uint previousBalances = balances[msg.sender].add(balances[_to]);
        // Subtract the token amount from the sender
        balances[msg.sender] = balances[msg.sender].sub(_value);
        // Add the token amount to the recipient
        balances[_to] = balances[_to].add(_value);
        // Emit the Transfer event
        emit Transfer(msg.sender, _to, _value);
        // Asserts are used to use static analysis to find bugs in code. They should never fail
        assert(balances[msg.sender].add(balances[_to]) == previousBalances);
        return true;
    }

    /*****************************************************************************
    * Get the most important token informations                                  *
    ******************************************************************************/
    function getSummary() public view returns (uint, address, string, string, uint8, uint256) {
        uint exponent = 10 ** uint(decimals);
        uint256 tokenUnits = _totalSupply / exponent;
        return(
            tokenUnits,
            owner,
            symbol,
            name,
            decimals,
            RATE
        );
    }

    /*****************************************************************************
    * Add a new shop to the collection of official shops                         *
    ******************************************************************************/
    function addShop(address _newShop) public onlyOwner returns (bool) {
        // TODO Check se lo shop è già presente..., deve essere unico
        // add shop in shops Array
        shops.push(_newShop);
        // add shop in shopsMap
        shopsMap[_newShop] = true;
        return true;
    }

    /*****************************************************************************
    * Returns the number of the official shops                                   *
    ******************************************************************************/
    function getShopsCount() public view returns (uint) {
        return shops.length;
    }

    /*****************************************************************************
    * Shop create a request to be payed  and pay the ISP                         *
    *                                                                            *
    *                                                                            *
    * @param _value                                                              *
    * @param _note                                                               *
    * @param _method                                                             *
    * @param _shopId                                                             *
    ******************************************************************************/
    function createEthereumPaymentRequest(uint _value, string _note, string _method, string _shopId)
        public onlyShop returns (bool) {
            // Check if the sender has enough
            require(balances[msg.sender] >= _value);
            // Check if the amount trasfered is greather than 0
            require(_value > 0);
            // Prevent transfer to 0x0 address. Use burn() instead
            require(owner != 0x0);
            // Check for overflows
            require(balances[owner] + _value > balances[owner]);
            // Check for underflows ?
            require(balances[msg.sender] - _value < balances[msg.sender]);
            // Create the new EthPaymentRequest
            EthereumPaymentRequest memory ethereumPaymentRequest = EthereumPaymentRequest({
                shop: msg.sender,
                note: _note,
                method: _method,
                value: _value,
                shopId: _shopId,
                completed: false
            });
            // Adding a new ethereum payment request
            ethereumPaymentRequests.push(ethereumPaymentRequest);
            // Value convertion
            _value = _value * 10 ** uint256(decimals);
            // Save for the future assertion
            uint previousBalances = balances[msg.sender].add(balances[owner]);
            // Subtract the token amount from the sender
            balances[msg.sender] = balances[msg.sender].sub(_value);
            // Add the token amount to the recipient
            balances[owner] = balances[owner].add(_value);
            // Emit the Transfer event
            emit Transfer(msg.sender, owner, _value);
            // Asserts are used to use static analysis to find bugs in code. They should never fail
            assert(balances[msg.sender].add(balances[owner]) == previousBalances);
            return true;
        }

    /*****************************************************************************
    * User create a request to buy a product from a shop                         *
    *                                                                            *
    *                                                                            *
    * @param _product                                                            *
    * @param _shopName                                                           *
    * @param _receiver                                                           *
    * @param _value                                                              *
    * @param _userId                                                             *
    ******************************************************************************/
    function createBuyingRequest(string _product, string _shopName, address _receiver, uint _value, string _userId)
        public returns (bool) {
            //TODO REQUIRE NO SHOP
            // Check if the sender has enough
            require(balances[msg.sender] >= _value);
            // Check if the amount trasfered is greather than 0
            require(_value > 0);
            // Prevent transfer to 0x0 address. Use burn() instead
            require(owner != 0x0);
            // Check for overflows
            require(balances[owner] + _value > balances[owner]);
            // Check for underflows ?
            require(balances[msg.sender] - _value < balances[msg.sender]);
            // Create the new BuyingRequest
            BuyingRequest memory buyingRequest = BuyingRequest({
                user: msg.sender,
                shop: _receiver,
                product: _product,
                shopName: _shopName,
                value: _value,
                userId: _userId,
                shipped: false
            });
            // Adding a new buy request
            buyingRequests.push(buyingRequest);
            // Value convertion
            _value = _value * 10 ** uint256(decimals);
            // Save for the future assertion
            uint previousBalances = balances[msg.sender].add(balances[owner]);
            // Subtract the token amount from the sender
            balances[msg.sender] = balances[msg.sender].sub(_value);
            // Add the token amount to the recipient
            balances[owner] = balances[owner].add(_value);
            // Emit the Transfer event
            emit Transfer(msg.sender, owner, _value);
            // Asserts are used to use static analysis to find bugs in code. They should never fail
            assert(balances[msg.sender].add(balances[owner]) == previousBalances);
            return true;
        }

    /*****************************************************************************
    * Used for returning ethereum payment requests done by shop one by one       *
    ******************************************************************************/
    function getRequestsCount() public view returns (uint256) {
        return ethereumPaymentRequests.length;
    }

    /*****************************************************************************
    * Used for returning user buy requests one by one                            *
    ******************************************************************************/
    function getUserRequestsBuyCount() public view returns (uint256) {
        return buyingRequests.length;
    }

    /****************************************************************************
    * Owner accepts the request and shop is notified                            *
    *                                                                           *
    * Owner finalize the request manually                                       *
    *                                                                           *
    * @param _index                                                             *
    *****************************************************************************/
    function finalizeUserRequestBuy(uint _index) public onlyShop {
        BuyingRequest storage buyingRequest = buyingRequests[_index];
        // Check if the product of the request is still not shipped.
        require(!buyingRequests[_index].shipped);
        // Set the request to shipped, this must be done after the product is shipped phisically by the shop.
        buyingRequest.shipped = true;
    }

    /****************************************************************************
    * Owner accepts the request and shop is payed in eth                        *
    *                                                                           *
    * Owner finalize the request manually                                       *
    *                                                                           *
    * @param _index                                                             *
    *****************************************************************************/
    function finalizeRequestEthereum(uint _index) public onlyOwner payable {
        EthereumPaymentRequest storage ethereumPaymentRequest = ethereumPaymentRequests[_index];
        // Check if still not collected.
        require(!ethereumPaymentRequests[_index].completed);
        // Convert Token to ethereum.
        uint256 ethValue = ethereumPaymentRequest.value.div(RATE);
        // Trasfer ethereum amount to the shop.
        //TODO controllare che sia in ehtereum il pagamento
        ethereumPaymentRequest.shop.transfer(ethValue);
        // Set status to completed.
        ethereumPaymentRequest.completed = true;
    }

    /*****************************************************************************
    * Used because string compare not present, so we need a trick for doing it   *
    ******************************************************************************/
    function compareStringsbyBytes(string s1, string s2) public pure returns(bool) {
        return keccak256(s1) == keccak256(s2);
    }
}
