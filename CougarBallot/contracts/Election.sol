pragma solidity ^0.5.0;

contract Election {
    // Read/write candidate
    //string public candidate;

    // Constructor
    constructor () public {
        //addCandidate("Candidate 1");
        //addCandidate("Candidate 2");
    }

    struct candidate {
        uint id;
        string name;
        string office;
        uint voteCount;   
    }

    struct ballot {
        //uint numCandidates;
        string name;
        string style;
        string openDate;
        string closeDate;
        uint numFSeats;
        uint numSSeats;
        uint numJSeats;
        uint numSrSeats;
    }

    struct ballotSetUp {
        uint numPC;
        uint numVPC;
        uint numFC;
        uint numSC;
        uint numJC;
        uint numSrC;
    }

    
     // Store accounts that have voted
    mapping(address => bool) public voters;

    mapping(uint => ballot) public ballotList;

    mapping(uint => candidate) public candidates;

    mapping(uint => ballotSetUp) public setUp;

    // Store Candidates Count
    uint public candidatesCount = 0;

    function createBallot(string memory _name, string memory _type, string memory _begin, string memory _end,
        uint _numF, uint _numS, uint _numJ, uint _numSr) public {
        ballotList[1] = ballot(_name, _type, _begin, _end, _numF, _numS, _numJ, _numSr); 
    }
    
    function createStructure(uint _numPC, uint _numVPC, uint _numFC, uint _numSC, uint _numJC, uint _numSRC) public {
        setUp[1] = ballotSetUp(_numPC, _numVPC, _numFC, _numSC, _numJC, _numSRC);
        candidatesCount = _numPC + _numVPC + _numFC + _numSC + _numJC + _numSRC;
    }

    function addCandidate(uint _id, string memory _name, string memory _office) public {
        candidates[_id] = candidate(_id, _name, _office, 0);

        //emit CandidateAdded(_id);

    }
    function completedVote() public {
        // record that voter has voted
        voters[msg.sender] = true;
    }

    function checkStatus() public view returns (bool) {
        return voters[msg.sender];
    }


    function vote (uint _candidateId) public {

        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);



        // update candidate vote Count
        candidates[_candidateId].voteCount ++;
    }


}