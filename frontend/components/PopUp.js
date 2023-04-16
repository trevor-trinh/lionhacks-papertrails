import React, { useState, useEffect } from 'react';
import {
  useContractReads,
  usePrepareContractWrite,
  useAccount,
  useContractWrite,
} from 'wagmi';
import { AUTH_ABI, AUTH_ADDRESS } from '@/config';

const Popup = ({ setFinalStep, finalStep, text, setFinishAll }) => {
  const [showPopup, setShowPopup] = useState(false);

  const [word, setWord] = useState('');

  const { address } = useAccount();

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

  useEffect(() => {
    if (isSuccess) {
      setFinishAll(true);
    }
  }, [isSuccess]);
  const handleTogglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleInputChange = (event) => {
    setWord(event.target.value);
  };

  const handleFormSubmit = (event) => {
    setTimeout(() => {
      alert('successful authentication!');

      //   event.preventDefault();
      //   console.log(`The word is: ${word}`);
      setFinalStep(true);
    }, 4000);
  };

  const closePopUp = () => {
    event.preventDefault();
    console.log(`The word is: ${word}`);
    setShowPopup(true);
  };

  useEffect(() => {
    getProof(address, word);
  }, [showPopup]);

  const proverAPI =
    'https://urrc4cdvzg.execute-api.us-east-2.amazonaws.com/default/zkaptchaprover';
  const getProof = async (wallet_address, captcha_text) => {
    return await fetch(proverAPI, {
      method: 'POST',
      // ex: walletadress = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
      // ex: captcha_text = "z4Tlw1"
      body: JSON.stringify({ pkey: wallet_address, preimage: captcha_text }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        const parsedData = JSON.parse(data);
        const decodedProof = Buffer.from(parsedData['proof'], 'base64');
        return decodedProof;
      })
      .catch((error) => {
        console.error('Error during POST request:', error);
      });
  };

  return (
    <div>
      {!finalStep ? (
        <div>
          <div className="text-sm">
            Please Submit A Verification Proof Powered by ZKaptcha:
          </div>
          <div className="flex flex-row">
            {showPopup && (
              <div className="popup">
                <form class="rounded-lg" onSubmit={handleFormSubmit}>
                  <input
                    placeholder="enter the word"
                    type="text"
                    id="word-input"
                    value={word}
                    onChange={handleInputChange}
                  />
                </form>
              </div>
            )}
            <button
              onClick={!showPopup ? handleTogglePopup : handleFormSubmit}
              class="text-white pt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
              {!showPopup ? 'Identification Proof' : 'Submit'}
            </button>
          </div>{' '}
        </div>
      ) : (
        <button
          onClick={() => write?.()}
          class="text-white pt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
          Submit Article
        </button>
      )}
    </div>
  );
};

export default Popup;
