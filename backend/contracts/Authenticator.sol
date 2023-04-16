//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

contract Authenticator is Ownable {
    event RequestCreated(
        address requester,
        string mediaRef,
        uint256 N,
        uint256 V,
        uint256 expiration,
        uint256 nonce
    );
    event RequestDeleted(
        address requester,
        string mediaRef,
        uint256 yes,
        uint256 nay,
        uint256 N,
        uint256 V,
        uint256 expiration,
        uint256 nonce,
        bool isVerified
    );
    event RequestVerified(
        address requester,
        string mediaRef,
        uint256 yes,
        uint256 nay,
        uint256 N,
        uint256 V,
        uint256 expiration,
        uint256 nonce,
        bool isVerified
    );
    event RequestDenied(
        address requester,
        string mediaRef,
        uint256 yes,
        uint256 nay,
        uint256 N,
        uint256 V,
        uint256 expiration,
        uint256 nonce,
        bool isVerified
    );
    event RequestVoted(
        address voter,
        address requester,
        bool decision,
        string message,
        uint256 requestNonce
    );

    struct request {
        address requester; //Address of the journalist who requested verification
        string mediaRef; //Reference to media, can be web2 link, ipfs link, arweave, etc.
        uint256 yea; //Number of yea votes
        uint256 nay; //Number of nay votes
        uint256 N; //Number of requests for verification needed
        uint256 V; //Number of votes needed to pass
        uint256 expiration; //Timestamp of when the request expires
        uint256 nonce; //Number of requests from this requester
        bool isVerified; //Has the request been verified?
    }

    address public authNFT;
    mapping(address => request) public requests;
    uint public totalUploads = 0;
    request[] public allRequests;
    mapping(address => mapping(address => uint)) public hasVoted;

    constructor(address _authNFT) {
        authNFT = _authNFT;
    }

    function requestVerification(
        string memory _mediaRef,
        uint256 _N,
        uint256 _V,
        uint256 _expiration
    ) public {
        require(_N > 3, 'At least 3 verfiers are needed');
        require(
            _expiration > block.timestamp,
            'Expiration must be in the future'
        );
        require(
            requests[msg.sender].expiration < block.timestamp,
            'You already have an active request'
        );
        require(_N >= _V, 'V must be less than or equal to N');
        require(2 * _V > _N, 'You must pass majority of votes');
        requests[msg.sender] = request(
            msg.sender,
            _mediaRef,
            0,
            0,
            _N,
            _V,
            _expiration,
            requests[msg.sender].nonce + 1,
            false
        );
        emit RequestCreated(
            msg.sender,
            _mediaRef,
            _N,
            _V,
            _expiration,
            requests[msg.sender].nonce
        );
        totalUploads += 1;
        allRequests.push(requests[msg.sender]);
    }

    function deleteRequest() public {
        emit RequestDeleted(
            msg.sender,
            requests[msg.sender].mediaRef,
            requests[msg.sender].yea,
            requests[msg.sender].nay,
            requests[msg.sender].N,
            requests[msg.sender].V,
            requests[msg.sender].expiration,
            requests[msg.sender].nonce,
            requests[msg.sender].isVerified
        );
        requests[msg.sender] = request(
            address(0),
            '',
            0,
            0,
            0,
            0,
            0,
            requests[msg.sender].nonce,
            false
        );
    }

    function viewRequest(
        address _requester
    ) public view returns (request memory) {
        return requests[_requester];
    }

    function viewHasVoted(
        address _requester,
        address _verifier
    ) public view returns (uint) {
        return hasVoted[_verifier][_requester];
    }

    function getNumRequests() public view returns (uint) {
        return totalUploads;
    }

    function getRequest(uint index) public view returns (request memory) {
        return allRequests[index];
    }

    function getRequests() public view returns (request[] memory) {
        return allRequests;
    }

    function assertValidity(
        bool _condition,
        address _requester,
        string memory _message
    ) public {
        require(
            IERC721(authNFT).balanceOf(msg.sender) > 0,
            'You must own the authenticator NFT'
        );
        require(
            requests[_requester].expiration > block.timestamp,
            'Request has expired'
        );
        require(
            requests[_requester].N >
                requests[_requester].yea + requests[_requester].nay,
            'Request has been resolved'
        );
        require(
            hasVoted[msg.sender][_requester] == requests[_requester].nonce,
            'You have already voted on this request'
        );

        hasVoted[msg.sender][_requester] = requests[_requester].nonce;
        if (_condition) {
            requests[_requester].yea++;
        } else {
            requests[_requester].nay++;
        }
        emit RequestVoted(
            msg.sender,
            _requester,
            _condition,
            _message,
            requests[_requester].nonce
        );
        if (
            requests[_requester].yea + requests[_requester].nay ==
            requests[_requester].N
        ) {
            if (requests[_requester].yea >= requests[_requester].V) {
                requests[_requester].isVerified = true;
                emit RequestVerified(
                    _requester,
                    requests[_requester].mediaRef,
                    requests[_requester].yea,
                    requests[_requester].nay,
                    requests[_requester].N,
                    requests[_requester].V,
                    requests[_requester].expiration,
                    requests[_requester].nonce,
                    requests[msg.sender].isVerified
                );
            } else {
                requests[_requester].isVerified = false;
                emit RequestDenied(
                    _requester,
                    requests[_requester].mediaRef,
                    requests[_requester].yea,
                    requests[_requester].nay,
                    requests[_requester].N,
                    requests[_requester].V,
                    requests[_requester].expiration,
                    requests[_requester].nonce,
                    requests[msg.sender].isVerified
                );
            }
            emit RequestDeleted(
                msg.sender,
                requests[msg.sender].mediaRef,
                requests[msg.sender].yea,
                requests[msg.sender].nay,
                requests[msg.sender].N,
                requests[msg.sender].V,
                requests[msg.sender].expiration,
                requests[msg.sender].nonce,
                requests[msg.sender].isVerified
            );
            requests[msg.sender] = request(
                address(0),
                '',
                0,
                0,
                0,
                0,
                0,
                requests[msg.sender].nonce,
                false
            );
        }
    }
}
