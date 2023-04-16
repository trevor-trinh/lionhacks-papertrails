import { AUTH_ABI, AUTH_ADDRESS } from '@/config';
import { useEffect, useState } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import Popup from './PopUp';

const PublishModal = ({ setShowModal, image }) => {
  const [text, setText] = useState('');
  const [finalStep, setFinalStep] = useState(false);
  const [finishAll, setFinishAll] = useState(false);

  const { config } = usePrepareContractWrite({
    address: AUTH_ADDRESS,
    abi: AUTH_ABI,
    functionName: 'requestVerification',
    args: [
      text,
      5,
      3,
      Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000),
    ],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (finishAll) {
      setShowModal(false);
    }
  }, finishAll);

  return (
    <div
      id="authentication-modal"
      tabIndex="-1"
      aria-hidden="true"
      class="bg-gray-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative w-full max-w-md max-h-full mx-auto">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="authentication-modal">
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="px-6 py-4 lg:px-8">
            <h3 class="pt-4 mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Upload an Article
            </h3>
            <form class="space-y-4" onSubmit={onSubmit}>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Content
                </label>
                <textarea
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  type="text"
                  name="media"
                  id="media"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="a breaking story..."
                  required
                />
              </div>
              <div class="flex flex-row">
                <Popup
                  setFinalStep={setFinalStep}
                  finalStep={finalStep}
                  text={text}
                  setFinishAll={setFinishAll}
                />
              </div>
            </form>
            {!finalStep && <img src={image} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
