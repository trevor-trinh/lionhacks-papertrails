import { useContractReads } from 'wagmi';
import { AUTH_ABI, AUTH_ADDRESS, TOKEN_ABI, TOKEN_ADDRESS } from '@/config';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

const StatsCard = () => {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      { address: AUTH_ADDRESS, abi: AUTH_ABI, functionName: 'totalUploads' },
      {
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'totalSupply',
      },
    ],
  });

  const [contributors, setContributors] = useState();
  const [totalUploads, setTotalUploads] = useState();

  useEffect(() => {
    if (data) {
      setTotalUploads(BigNumber.from(data[0]).toString());
      setContributors(BigNumber.from(data[1]).toString());
    }
  }, [isLoading]);

  return (
    <div class="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow ">
      <h5 class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        📝 Statistics
      </h5>

      <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      <div class="flex flex-row justify-between py-4 gap-4">
        <div>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Total Contributors
          </p>
          {!isLoading && contributors}
        </div>
        <div>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Total Uploads
          </p>
          {!isLoading && totalUploads}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default StatsCard;
