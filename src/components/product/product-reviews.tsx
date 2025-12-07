import React, { useState } from 'react';

import Review from '@/types/review';

import { useTranslation } from '@/lib/i18n-utils';

export default function ProductReviews({ reviews }: { reviews: Review[] }) {
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  // Count ratings by star level
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <div className="p-4 md:p-6 pb-12">
      <h2 className="text-3xl font-bold mb-6 md:mb-8 text-white">{t('customer_reviews')}</h2>

      {/* Rating Summary Section - Responsive Layout */}
      <div className="flex flex-col md:flex-row w-full rounded-lg mb-8">
        {/* Left Column (Mobile: Top) - Average Rating */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 md:pr-10 md:w-1/3">
          {/* Rating Number */}
          <div className="mb-2">
            <span className="text-5xl md:text-7xl font-bold text-white">{averageRating}</span>
          </div>

          {/* Star Rating */}
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-xl md:text-2xl text-lime-500">★</span>
            ))}
          </div>
          {/* Review Count */}
          <p className="text-sm text-gray-300">{reviews.length} {t('reviews')}</p>
        </div>

        {/* Right Column (Mobile: Bottom) - Rating Bars */}
        <div className="w-full md:w-2/3 space-y-2 md:space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-12 md:w-16 text-xs md:text-sm text-white">{star} {t('star')}</span>
              <div className="flex-1 h-1.5 md:h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime-500"
                  style={{
                    width: `${reviews.length ? (ratingCounts[star as keyof typeof ratingCounts] / reviews.length) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <span className="w-6 md:w-8 text-right text-xs md:text-sm text-white">{ratingCounts[star as keyof typeof ratingCounts]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="flex mb-8">        <button
        className="bg-[#0E1E27] hover:bg-[#172A36] text-white py-2.5 md:py-3 px-6 md:px-8 rounded-md w-full max-w-lg transition-all duration-200 border border-lime-500"
        onClick={() => setShowReviewForm(!showReviewForm)}
      >
        {t('write_review')}
      </button>
        <button className="bg-[#0E1E27] hover:bg-[#172A36] text-white p-2.5 md:p-3 rounded-md ml-3 md:ml-4 flex items-center justify-center border border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
        </button>
      </div>

      {/* Review form */}
      {showReviewForm && (
        <div className=" rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">{t('write_your_review')}</h3>
          <form className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">{t('rating')}</label>
              <div className="flex gap-1 md:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-xl md:text-2xl text-gray-400 hover:text-lime-500 focus:outline-none"
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">{t('your_review')}</label>
              <textarea
                className="w-full bg-[#172A36] border border-gray-700 rounded-md p-2 md:p-3 text-white text-sm md:text-base"
                rows={4}
                placeholder={t('review_placeholder')}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-lime-600 hover:bg-lime-700 text-white text-sm md:text-base py-1.5 md:py-2 px-4 md:px-6 rounded-md transition-colors"
              >
                {t('submit_review')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Individual reviews */}
      <div className="space-y-4 md:space-y-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="border-b border-gray-700 pb-4 md:pb-6 mb-4 md:mb-6 last:border-0">
            <div className="flex items-center mb-3 md:mb-4">
              {/* Avatar */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0E1E27] flex items-center justify-center mr-2 md:mr-3">
                <span className="text-white text-xs md:text-sm font-medium">
                  {getInitials(review.customer.username)}
                </span>
              </div>
              <div>
                {/* Username */}
                <div className="text-white text-sm md:text-base font-medium">
                  {review.customer.username}
                </div>
                {/* Date */}
                <div className="text-gray-500 text-xs md:text-sm">
                  {review.created_at}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg md:text-xl ${i < review.rating ? 'text-lime-500' : 'text-gray-500'}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review text */}
            <p className="text-white text-sm md:text-base">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
