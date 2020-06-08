/*
  This file is part of Shenanigan.
  Shenanigan is free software: you can redistribute it and/or modify
  it under the terms of the
pragma solidity >=0.4.21 <0.7.0;r version.
  Shenanigan is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with Shenanigan. If not, see <http://www.gnu.org/licenses/>.
*/
pragma solidity >=0.4.21 <0.7.0;
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Voting {

    // Vote from the streamer
    uint256 primaryVote;

    struct Voter {
        bool hasVoted;
        uint256 option;
    }
    mapping(address => Voter) voters;


    bool isOpen;
    uint256 optionCount;
    uint256[] totalVotes;

    constructor(uint256 _primaryVote, uint256 _optionCount) public {
        owner = msg.sender;
        primaryVote = _primaryVote;
        optionCount = _optionCount;
        isOpen = true;
    }

    function addVote(uint256 _option) public {
        require(isOpen == true);
        require(voters[msg.sender].hasVoted == false);
        require(_option <= optionCount);
        voters[msg.sender].option = _option;
        totalVotes[_option] += 1;
    }
    
    function changeVote(uint256 _option) public {
        require(isOpen == true);
        require(voters[msg.sender].hasVoted == true);
        require(_option <= optionCount);
        totalVotes[voters[msg.sender].option] -= 1;
        totalVotes[_option] += 1;
    }

    function closeVote() public isOwner {
        isOpen = false;
    }

    function getTotals() public view returns (uint256[] memory){
        return totalVotes;
    }
}