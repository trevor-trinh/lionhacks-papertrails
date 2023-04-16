import ArticleCard from './ArticleCard';
import { useContractReads } from 'wagmi';
import { AUTH_ADDRESS, AUTH_ABI, TOKEN_ABI, TOKEN_ADDRESS } from '@/config';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

const hardCodedArticles = [
  { date: '4/22/23', story: 'New research shows benefits of exercise...' },
  { date: '5/6/23', story: 'Company X announces new product launch...' },
  {
    date: '6/18/23',
    story: 'Local charity event raises thousands of dollars...',
  },
  { date: '7/2/23', story: 'Controversy over proposed city ordinance...' },
  {
    date: '8/15/23',
    story: 'Upcoming festival to feature popular musical acts...',
  },
  {
    date: '9/1/23',
    story: 'Expert discusses importance of mental health awareness...',
  },
  {
    date: '10/8/23',
    story: 'New study finds correlation between diet and longevity...',
  },
  {
    date: '11/21/23',
    story: 'Business leaders discuss economic forecast for next year...',
  },
  { date: '12/10/23', story: 'City council approves funding for new park...' },
  {
    date: '1/5/24',
    story: 'Interview with famous author about latest book release...',
  },
];

const UploadsCard = () => {
  const [articles, setArticles] = useState([]);
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      //   { address: AUTH_ADDRESS, abi: AUTH_ABI, functionName: 'totalUploads' },
      {
        address: AUTH_ADDRESS,
        abi: AUTH_ABI,
        functionName: 'getRequests',
      },
    ],
  });

  useEffect(() => {
    if (!isLoading && !(data === undefined || data.length == 0)) {
      console.log('THIS IS DATA', data);
      setArticles(data);
    }
  }, [isLoading, data, articles]);

  return (
    <div class="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow ">
      <h5 class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        🚀 Recent Uploads
      </h5>

      <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      <div className="flex flex-wrap justify-center items-center gap-1 mt-4">
        {/* {!isError &&
          hardCodedArticles.map((item) => (
            <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <ArticleCard article={item} date={item.date} story={item.story} />
            </div>
          ))} */}
        {articles.length == 1 &&
          articles[0]
            .slice(0)
            .reverse()
            .map((item) => (
              <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                <ArticleCard
                  article={item}
                  address={item[0]}
                  story={item[1]}
                  date={
                    new Date(
                      BigNumber.from(item[6]).toNumber() * 1000
                    ).getFullYear() +
                    '-' +
                    String(
                      new Date(
                        BigNumber.from(item[6]).toNumber() * 1000
                      ).getMonth() + 1
                    ).padStart(2, '0') +
                    '-' +
                    String(
                      new Date(
                        BigNumber.from(item[6]).toNumber() * 1000
                      ).getDate()
                    ).padStart(2, '0') +
                    ' ' +
                    String(
                      new Date(
                        BigNumber.from(item[6]).toNumber() * 1000
                      ).getHours()
                    ).padStart(2, '0') +
                    ':' +
                    String(
                      new Date(
                        BigNumber.from(item[6]).toNumber() * 1000
                      ).getMinutes()
                    ).padStart(2, '0')
                  }
                />
              </div>
            ))}
      </div>
    </div>
  );
};

export default UploadsCard;
