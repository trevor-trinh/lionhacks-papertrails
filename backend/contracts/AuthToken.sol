// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AuthToken is ERC721PresetMinterPauserAutoId {
    constructor() ERC721PresetMinterPauserAutoId("PaperTrails", "PPT", "") {}
}