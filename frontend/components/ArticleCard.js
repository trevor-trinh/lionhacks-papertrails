import { useEffect, useState } from 'react';
import { AUTH_ABI, AUTH_ADDRESS } from '@/config';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import ViewModal from './ViewModal';

const ArticleCard = ({ date, story, address }) => {
  const [show, setShow] = useState(false);

  const { config } = usePrepareContractWrite({
    address: AUTH_ADDRESS,
    abi: AUTH_ABI,
    functionName: 'assertValidity',
    args: [
      true,
      '0x1DA8CDb1E4e27Ec2b1F643675691776e35437C25',
      'this is a great proposal',
      Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000),
    ],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div
      class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
      style={{ maxWidth: '17rem' }}>
      <a href="#">
        <img class="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
      </a>
      <div class="p-5">
        <p class="mb-4 font-bold tracking-tight text-gray-900 dark:text-white overflow-hidden">
          Address: {address}
        </p>
        <p>Expires: {date}</p>
        <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700" />

        <p class="mt-2 mb-4 font-normal text-gray-700 dark:text-gray-400 truncate">
          {story}
        </p>

        <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700" />

        <div class="flex flex-row justify-between mt-4">
          <button
            onClick={() => setShow(true)}
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            view
          </button>
          <button
            onClick={() => write?.()}
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            verify
          </button>
        </div>
        {show && (
          <ViewModal
            setShowModal={setShow}
            address={address}
            date={date}
            story={story}
          />
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
