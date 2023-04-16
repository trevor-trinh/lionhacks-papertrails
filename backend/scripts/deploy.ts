import { ethers, run } from 'hardhat';

async function main() {
  const tokenFactory = await ethers.getContractFactory('AuthToken');
  const contract = await tokenFactory.deploy();
  await contract.deployed();
  await contract.mint('0x1DA8CDb1E4e27Ec2b1F643675691776e35437C25');

  console.log('NFT deployed to:', contract.address);

  const authenticatorFactory = await ethers.getContractFactory('Authenticator');
  const contract2 = await authenticatorFactory.deploy(contract.address);
  await contract2.deployed();
  console.log('Authenticator deployed to:', contract2.address);

  // doesn't work rip
  // console.log('Waiting for Authenticator bytecode...');
  // await ethers.provider.getCode(contract2.address);

  // await run('verify:verify', {
  //   address: contract2.address,
  //   constructorArguments: [contract.address],
  //   constructorArgumentsTypes: ['address'],
  //   network: 'mumbai',
  // });

  // console.log('Authenticator contract verified!');
  console.log('run this in the console after a bit:');
  console.log(
    `npx hardhat verify --network arbitrum ${contract2.address} ${contract.address}`
  );
  console.log(
    `npx hardhat verify --network arbitrum --contract contracts/AuthToken.sol:AuthToken ${contract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
