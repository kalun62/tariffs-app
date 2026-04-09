"use client";
import { useEffect, useState, useRef} from "react";

import { HeaderTimer } from "@/components/HeaderTimer";

import { useTariffs } from "@/hooks/useTariffs";
import { getDiscount } from "@/utils/getDiscount";

export default function Home() {
  const { tariffs, loading } = useTariffs();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [discountExpired, setDiscountExpired] = useState(false);
  const [displayPrices, setDisplayPrices] = useState<number[]>([]);

  const [agreed, setAgreed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [timerError, setTimerError] = useState(false);

  const animationStarted = useRef(false);
  
  useEffect(() => {
    const bestIndex = tariffs.findIndex(t => t.is_best);
    if (bestIndex !== -1) setSelectedId(bestIndex);
  }, [tariffs]);
  
  useEffect(() => {
    if (tariffs.length > 0) {
      setDisplayPrices(tariffs.map(t => t.price));
    }
  }, [tariffs]);
  
  useEffect(() => {
    if (!discountExpired || animationStarted.current) return; // если скидка ещё не истекла или анимация уже была — не делаем ничего

    animationStarted.current = true; // ставим флаг, что анимация идёт

    tariffs.forEach((t, i) => {
      if (t.price === t.full_price) return; // если цена не меняется, пропускаем

      const from = t.price;
      const to = t.full_price;
      const duration = 600;
      let start: number | null = null;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const val = Math.round(from + (to - from) * progress);

        // обновляем только если значение реально поменялось
        setDisplayPrices(prev => {
          if (prev[i] === val) return prev;
          const copy = [...prev];
          copy[i] = val;
          return copy;
        });

        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  }, [discountExpired]); 

  if (loading) {
    return <div className="p-10 font-montserrat text-white bg-[#232829] min-h-screen">Загрузка...</div>;
  }

  return (
    <>
      <HeaderTimer
        onExpire={() => setDiscountExpired(true)}
        highlightError={timerError}
      />

      <main className="bg-[#232829] min-h-screen font-montserrat flex justify-center pt-24 md:pt-44 md:pt-36">
        <div className="w-full p-4 md:w-[70%] md:p-0">
          {/* Заголовок */}
          <h1 className="text-[24px] md:text-[40px] font-bold mb-12 text-white text-left">
            Выбери подходящий для себя <span className="text-[#FDB056]">тариф</span>
          </h1>

          {/* Двухколоночная структура */}
          <div className="flex flex-col md:flex-row md:gap-6 gap-1">
            {/* Левая картинка */}
            <div className="w-full md:w-1/3 flex justify-center items-center md:items-start">
              <img
                src="/images/man.png"
                alt="Инфо"
                className="w-1/2 md:w-full h-auto object-contain"
              />
            </div>

            {/* Правая колонка с карточками тарифов */}
            <div className="md:w-2/3 flex flex-col gap-4">
              {tariffs.length > 0 && (
                <>
                  {/* Первая карточка на всю ширину */}
                    <div
                        key={tariffs[0].id}
                        onClick={() => setSelectedId(0)}
                        className={`
                          relative py-6 md:px-2 px-4 flex justify-center content-center shadow cursor-pointer transition-all
                          bg-[#313637]
                          border-2 ${selectedId === 0 ? "border-[#FDB056]" : "border-[#484D4E]"}
                          rounded-[34px]
                          ${selectedId === 0 ? "scale-102" : "hover:scale-102"}
                        `}
                      >
                      {tariffs[0].is_best && (
                        <div className="absolute md:top-[10px] top-[6px] md:right-[20px] right-[14px] md:text-[20px] text-[16px] text-[#FDB056] p-0">
                          хит!
                        </div>
                      )}
                      <div className="absolute top-0 md:left-[50px] md:right-auto right-[62px] bg-[#FD5656] text-white font-normal md:text-[20px] text-[16px]  px-2 py-[2px] rounded-b-lg">
                        -{getDiscount(tariffs[0].price, tariffs[0].full_price)}%
                      </div>

                      <div className="flex items-center justify-around gap-6 w-full md:w-[80%] md:py-3">
                        {/* Левая часть: текст и цены */}
                        <div className="flex flex-col items-center gap-1">
                          {/* Основной текст сверху */}
                          <h2 className="text-[white] md:text-[26px] text-[18px] font-semibold w-full md:text-center text-left">
                            {tariffs[0].period}
                          </h2>

                          {/* Основная цена */}
                            <div
                              className={`md:text-[50px] text-[34px] font-semibold flex items-baseline md:gap-3 gap-1 text-center transition-all duration-500
                                ${selectedId === 0 ? "text-[#FDB056]" : "text-white"}`}
                            >
                              {/* Анимируем смену цифр через span с transition */}
                              <span
                                className={`inline-block transition-all duration-500 ease-in-out transform ${
                                  discountExpired ? "opacity-100 scale-90" : "opacity-100 scale-100"
                                }`}
                                key={displayPrices[0]}
                              >
                                {displayPrices[0]}
                              </span>
                              <span className="md:text-[50px] text-[34px]">₽</span>
                            </div>

                            {/* Зачеркнутая цена */}
                            <div
                              className={`w-full text-[#919191] md:text-[24px] text-[16px] text-right -mt-3 md:-mt-5 line-through transition-opacity duration-500 ${
                                discountExpired ? "opacity-0" : "opacity-100"
                              }`}
                            >
                              {tariffs[0].full_price} ₽
                            </div>
                        </div>

                        {/* Правая часть: текст справа */}
                         {/* Мобильная версия */}
                          <p className="block md:hidden w-full block text-[white] md:text-[16px] text-[14px] text-left mt-4 ">
                            Всегда <br></br> быть в форме
                          </p>

                          {/* Десктопная версия */}
                          <p className="hidden md:block text-[white] md:text-[16px] text-[14px] text-left mt-4w-full mt-4 ">
                            {tariffs[0].text}
                          </p>
                      </div>
                    </div>

                    {/* Нижние 3 карточки в ряд, но на мобилках в столбец */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 md:gap-4 gap-2">
                      {tariffs.slice(1).map((tariff, index) => (
                        <div
                          key={tariff.id}
                          onClick={() => setSelectedId(index + 1)}
                          className={`
                            relative py-6 md:px-2 px-4 flex justify-center content-center shadow cursor-pointer transition-all
                            bg-[#313637]
                            border-2 ${selectedId === index + 1 ? "border-[#FDB056]" : "border-[#484D4E]"}
                            rounded-[40px]
                            ${selectedId === index + 1 ? "scale-105" : "hover:scale-102"}
                          `}
                        >
                          {tariff.is_best && (
                            <div className="absolute top-[10px] right-[20px] text-[20px] text-[#FDB056] p-0">
                              хит!
                            </div>
                          )}
                          <div className="absolute top-0 md:left-[50px] md:right-[auto] right-[30px] bg-[#FD5656] text-white font-normal md:text-[20px] text-[16px] px-2 py-[2px] rounded-b-lg">
                            -{getDiscount(tariff.price, tariff.full_price)}%
                          </div>

                          <div className="md:text-center w-full flex md:flex-col justify-around items-center gap-4 mt-4">
                            <div className="">
                              <h2 className="text-[white] md:text-[26px] text-[18px] font-semibold md:mb-6">
                                {tariff.period}
                              </h2>

                              {/* Основная цена */}
                                <div
                                  className={`md:text-[50px] text-[34px] font-semibold flex items-baseline gap-2 transition-all duration-500 ${
                                    selectedId === index + 1 ? "text-[#FDB056]" : "text-white"
                                  }`}
                                >
                                  <span
                                    className={`inline-block transition-all duration-500 ease-in-out transform`}
                                    key={displayPrices[index + 1]}
                                  >
                                    {displayPrices[index + 1]}
                                  </span>
                                  <span className="md:text-[50px] text-[34px]">₽</span>
                                </div>

                                {/* Зачеркнутая цена */}
                                <div
                                  className={`w-full text-[#919191] md:text-[24px] text-[16px] text-right -mt-3 md:-mt-5 line-through transition-opacity duration-500 ${
                                    discountExpired || tariff.price === tariff.full_price ? "opacity-0" : "opacity-100"
                                  }`}
                                >
                                  {tariff.full_price} ₽
                                </div>
                            </div>
                            
                            <div className="text-[white] md:text-[16px] text-[14px] text-left mt-4w-full mt-4 ">
                              <p>{tariff.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                </>
              )}


              {/* Плашка под карточками */}
              <div className="mt-4 bg-[#2D3233] rounded-[20px] flex items-start gap-4 p-4 md:w-2/3 w-full">
                {/* Левая часть: иконка */}
                <div className="text-[#FDB056] text-[24px] font-semibold pt-1">
                  !
                </div>

                {/* Правая часть: текст */}
                <div className="text-white md:text-[16px] text-[12px] font-normal">
                  Следуя плану на 3 месяца и более, люди получают в 2 раза лучший результат, чем за 1 месяц
                </div>
              </div>

              {/* Блок покупки под карточками */}
              <div className="mt-6 flex flex-col gap-4 md:w-[80%] w-full">
                {/* Кастомный чекбокс с текстом */}
                  <label className="flex items-center md:items-start gap-3 cursor-pointer md:w-[80%] w-full">
                    <div className={`relative w-6 h-6 md:w-8 md:h-8 flex-shrink-0 
                        ${showError ? 'border-red-500 animate-pulse' : ''}`}>
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={() => {
                          setAgreed(!agreed);
                          setShowError(false); 
                        }}
                        className="absolute w-6 h-6 md:w-8 md:h-8 opacity-0 cursor-pointer"
                      />
                      <div className={`w-6 h-6 md:w-8 md:h-8 border-2 rounded-[4px] flex items-center justify-center
                        ${showError ? 'border-red-500' : 'border-[#606566]'}`}>
                        {agreed && (
                          <svg
                            className="w-3 h-3 md:w-5 md:h-5 text-[#FDB056]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-[#CDCDCD] text-[12px] md:text-[16px] font-normal">
                      Я согласен с <a href="#" className="underline">офертой рекуррентных платежей</a> и <a href="#" className="underline">Политикой конфиденциальности</a>
                    </p>
                  </label>

                  {/* Кнопка покупки */}
                  <button
                    onClick={() => {
                      if (!agreed) {
                        setShowError(true);
                        setTimerError(true);
                        return;
                      }
                      alert(`Куплен тариф: ${selectedId !== null ? tariffs[selectedId].period : "не выбран"}`);
                    }}
                    className={`w-full md:w-[50%] py-3 px-6 rounded-[14px] text-[14px] md:text-[20px] font-semibold text-black bg-[#FDB056] 
                      transition-all hover:bg-[#e6b14c] cursor-pointer ${
                        showError ? "animate-pulse bg-red-500 text-white" : ""
                      }`}
                  >
                    Купить
                  </button>

                {/* Текст под кнопкой */}
                <p className="text-[#9B9B9B] text-justify text-[10px] md:text-[14px] font-normal w-full">
                  Нажимая кнопку «Купить», Пользователь соглашается на разовое списание денежных средств для получения пожизненного доступа к приложению. Пользователь соглашается, что данные кредитной/дебетовой карты будут сохранены для осуществления покупок дополнительных услуг сервиса в случае желания пользователя.
                </p>
              </div>
            </div>
          </div>

          {/* Гарантийная плашка */}
          <div className="mt-4 md:mt-8 mb-12 w-full  p-6 rounded-[20px] md:rounded-[30px] border border-[#484D4E] bg-[#232829]">
            {/* Внутренняя плашка с текстом "Гарантия возврата 30 дней" */}
            <div className="w-full md:w-1/3 mb-2 px-3 py-1 md:px-6 md:py-3 text-center text-[#81FE95] text-[14px] md:text-[26px] font-medium rounded-[30px] border border-[#81FE95] bg-[#2D3233]">
              гарантия возврата 30 дней
            </div>

            {/* Текст под внутренней плашкой */}
            <p className="text-[#DCDCDC] text-[14px] w-full text-justify md:text-[24px] font-normal text-left">
              Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже через 4 недели! Мы даже готовы полностью вернуть твои деньги в течение 30 дней с момента покупки, если ты не получишь видимых результатов.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}