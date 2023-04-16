import { Web3Button } from '@web3modal/react';
import { useState, useEffect } from 'react';
import PublishModal from './PublishModal';
import { TOKEN_ABI, TOKEN_ADDRESS } from '@/config';
import { useContractReads, usePrepareContractWrite, useAccount } from 'wagmi';
import PopUp from './PopUp';

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [image, setImage] = useState();

  const { address } = useAccount();

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'balanceOf',
        args: [address],
      },
    ],
  });

  useEffect(() => {
    getProof(address, image);
  }, [image]);

  // rough sketch of querying the API
  async function getCaptcha() {
    const captchaAPI =
      'https://sx2mbwnkk9.execute-api.us-east-2.amazonaws.com/default/zkaptcha-py';
    try {
      const response = await fetch(captchaAPI);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const resptext = await response.text();
      const b64data = JSON.parse(resptext).png;
      const pngData = b64data.replace(/-/g, '+').replace(/_/g, '/');
      setImage('data:image/png;base64,' + pngData);
      return 'data:image/png;base64,' + pngData;
    } catch (error) {
      console.error('Error fetching captcha:', error);
      return null;
    }
  }

  // rough sketch of sending args to the prover
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

  useEffect(() => {
    console.log(data);
    if (
      !(data === undefined || data.length == 0) &&
      data[0] != null &&
      data[0].toNumber() > 0
    ) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, [verified, address, data]);

  return (
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" class="flex items-center">
          <img src="favicon.png" class="h-8 mr-3" alt="PaperTrails" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            paper trail
          </span>
        </a>
        <div class="flex md:order-2 gap-3">
          <div class="flex items-center justify-center mr-3">
            {verified ? (
              <p class="text-black">Verified!</p>
            ) : (
              <p class="text-black">Welcome, Visitor!</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setShowModal((prev) => !prev);
              getCaptcha();
            }}
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Publish
          </button>
          {showModal && (
            <PublishModal setShowModal={setShowModal} image={image} />
          )}

          <Web3Button />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
