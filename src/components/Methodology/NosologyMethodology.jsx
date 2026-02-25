export default function NosologyMethodology() {
  const MathText = ({ children, className = "" }) => (
    <span className={`font-serif italic ${className}`}>{children}</span>
  );

  const Fraction = ({ num, den }) => (
    <div className="inline-flex flex-col items-center align-middle mx-1 vertical-align-middle">
      <div className="border-b border-black text-center w-full px-1 mb-[2px] leading-tight">
        {num}
      </div>
      <div className="text-center w-full px-1 mt-[1px] leading-tight">
        {den}
      </div>
    </div>
  );

  const Sigma = ({ bottom, top }) => (
    <div className="inline-flex flex-col items-center align-middle mx-1 relative -top-1">
      {top && <span className="text-[0.6em] md:text-[0.7em] leading-none mb-0.5">{top}</span>}
      <span className="text-lg md:text-xl leading-none font-serif not-italic">∑</span>
      <span className="text-[0.5em] md:text-[0.6em] leading-none mt-0.5 max-w-[80px] md:max-w-[120px] text-center">
        {bottom}
      </span>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 text-xs md:text-sm leading-relaxed p-4 md:p-8 pt-2 text-gray-900">
      <section className="border-b pb-4">
        <h3 className="text-base md:text-lg font-semibold mb-2">
          Цель исследования
        </h3>
        <p className="mb-4">
          Обеспечить единый подход к расчёту, визуализации и прогнозированию
          смертности, материнской смертности и Д-учёта в аналитической системе.
        </p>

        <h3 className="text-base md:text-lg font-semibold mb-2">
          Задачи исследования
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Организация мониторинга смертности.</li>
          <li>Анализ динамики по полу, возрасту, сезонам и причинам.</li>
          <li>Оценка связи Д-учёта и смертности.</li>
          <li>Формирование прогноза смертности.</li>
          <li>Выявление лагов, трендов и сезонных факторов.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base md:text-lg font-semibold mb-2 text-center">Карта</h3>
        <p className="mb-2">Карта показывает:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>распределение смертности по территории;</li>
          <li>прикрепленные зоны МО;</li>
          <li>демографическую структуру населения;</li>
          <li className="font-semibold">проблемные территории.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-base md:text-lg font-semibold mb-3 text-center">
          Раздел “Главная” (общая смертность)
        </h3>
        <p className="mb-2 font-medium">Основные показатели:</p>
        <ul className="list-disc pl-5 space-y-1 mb-4 text-gray-700">
          <li>Годовая смертность - Месячная смертность</li>
          <li>Половоростной состав</li>
          <li>
            Сезонность (средняя смертность по сезонам):
            <ul className="list-circle pl-5 mt-1 text-[10px] md:text-xs text-gray-600">
              <li>Зима (дек–фев)</li>
              <li>Весна (мар–май)</li>
              <li>Лето (июн–авг)</li>
              <li>Осень (сен–ноя)</li>
            </ul>
          </li>
          
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 md:space-y-8 overflow-x-auto">
            <div className="flex items-center text-sm md:text-lg font-serif">
              <MathText>Season_mean</MathText>
              <span className="mx-2">=</span>
              <Fraction num="1" den={<MathText>N</MathText>} />
              <Sigma bottom={<MathText>t</MathText>} />
              <MathText className="ml-1">deaths(t)</MathText>
            </div>
          </div>

          <li className="pt-4">ТОП-10 нозологий (МКБ)</li>
        
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm space-y-8 overflow-x-auto">
            <div className="flex items-center text-sm md:text-lg font-serif">
              <MathText>count(ICD_group)</MathText>
              <span className="mx-2">=</span>
              <Sigma bottom={<MathText>cases ∈ group</MathText>} />
              <span className="ml-1">1</span>
            </div>
          </div>

          <li className="pt-4">ТОП-10 медицинских организаций по смертности</li>
          
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm space-y-8 overflow-x-auto">
            <div className="flex items-center text-sm md:text-lg font-serif">
              <MathText>MO_rank</MathText>
              <span className="mx-2">=</span>
              <span className="not-italic">sort</span>(
              <MathText>deaths</MathText>
              <sub className="not-italic text-[0.6em] md:text-xs">MO</sub>)
            </div>
          </div>
        </ul>
      </section>

      <section>
        <h3 className="text-base md:text-lg font-semibold mb-3 text-center">
          Раздел “Материнская смертность”
        </h3>
        <p className="mb-3 text-gray-700">
          Материнская смертность рассчитывается в соответствии с международными
          стандартами (ВОЗ) и включает смерти женщин, имеющих диагнозы из класса
          МКБ-10: <strong>O00–O99</strong>
        </p>
        <p className="mb-3 text-gray-700 font-semibold">
          Формула:
        </p>

        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm space-y-8 overflow-x-auto mb-6">
          <div className="flex items-center text-sm md:text-lg font-serif">
            <span className="not-italic mr-2">Материнская смертность</span>
            <span className="mx-2">=</span>
            <Fraction
              num="Число умерших женщин с диагнозами O00–O99"
              den="Число живорождений"
            />
            <span className="mx-2">× 1000</span>
          </div>
        </div>

        <p className="text-gray-700 mb-2">
          Детская смертность (до 1 года)
        </p>
        <p className="text-gray-700 mb-4 font-semibold">
          Формула:
        </p>
          <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm space-y-8 overflow-x-auto">
            <div className="flex items-center text-sm md:text-lg font-serif">
              <span className="not-italic mr-2">Детская смертность</span>
              <span className="mx-2">=</span>
                <Fraction
                  num="Число детей, умерших до 1 года"
                  den="Число живорождений"
                />
              <span className="mx-2">× 1000</span>
            </div>
          </div>
        <p className="mt-4 text-gray-700">
          <br />
          <span className="text-blue-600 font-bold">■ синяя линия</span> —
          детская смертность;
          <br />
          <span className="text-red-600 font-bold">■ красная линия</span> —
          материнская смертность;
          <br />
          <span className="text-[10px] md:text-xs text-gray-500">
            *показатели приведены в расчёте на 1000 живорождений, что позволяет
            корректно сравнивать годы между собой.
          </span>
        </p>
      </section>

      <section>
        <p className="mb-4 text-gray-700">
          Раздел «Прикреплённое МО» Отображает материнскую и детскую смертность в разрезе медицинских
          организаций, к которым относящиеся пациенты были прикреплены на момент
          оказания медицинской помощи.
        </p>

        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm space-y-8 overflow-x-auto">
          <div>
            <p className="font-bold text-gray-800 mb-2">
              1. Материнская смертность по прикреплённому МО
            </p>
            <div className="flex items-center text-sm md:text-lg font-serif ml-4">
              <MathText>MS</MathText>
              <sub className="not-italic text-[0.6em] md:text-xs mr-2">MO</sub>
              <span className="mx-2">=</span>
              <Sigma bottom={<MathText>i:ICD(i) ∈ O00–O99</MathText>} />
              <span className="ml-1 mr-4">1,</span>
              <MathText>i ∈ MO</MathText>
              <sub className="text-[0.6em] md:text-xs">attached</sub>
            </div>
            <p className="mt-2 text-[10px] md:text-xs text-gray-500 ml-4">
              Где: <MathText>ICD(i) ∈ O00 – O99</MathText> — материнские причины
              смерти по МКБ-10.
            </p>
          </div>

          <div>
            <p className="font-bold text-gray-800 mb-2">
              2. Детская смертность по прикреплённому МО
            </p>
            <div className="flex items-center text-sm md:text-lg font-serif ml-4">
              <MathText>ChildMS</MathText>
              <sub className="not-italic text-[0.6em] md:text-xs mr-2">MO</sub>
              <span className="mx-2">=</span>
              <Sigma bottom={<MathText>i:age(i) &lt; 1 год</MathText>} />
              <span className="ml-1 mr-4">1,</span>
              <MathText>i ∈ MO</MathText>
              <sub className="text-[0.6em] md:text-xs">attached</sub>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-gray-800 mb-1">
            3. Материнская смерть по МО
          </h4>
          <p className="text-gray-700">
            Данный показатель отражает количество случаев материнской
            смертности, зарегистрированных в конкретных медицинских организациях
            стационарного типа, где пациентка получала медицинскую помощь на
            момент события.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-base md:text-lg font-semibold mb-3 text-center">Раздел “Д-учёт”</h3>
        <ul className="list-disc pl-5 space-y-1 mb-6 text-gray-700">
          <li>Регистрации в Д-учёте</li>
          <li>Возрастные группы</li>
          <li>Топ-15 МО по числу пациентов</li>
          <li>Математическая модель прогноза</li>
        </ul>

        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 overflow-x-auto">
          <div>
            <h5 className="font-bold text-xs md:text-sm text-gray-900 mb-2">
              Лаговые признаки
            </h5>
            <div className="flex items-center text-sm md:text-lg font-serif ml-2">
              <MathText>reg_lag</MathText>
              <sub className="not-italic text-[0.6em] md:text-xs">k</sub>
              <span className="not-italic">(t)</span>
              <span className="mx-2">=</span>
              <MathText>registry</MathText>
              <span className="not-italic">(t - k),</span>
              <span className="ml-4 italic">k ∈ {"{1, 3, 6, 12}"}</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-xs md:text-sm text-gray-900 mb-2">
              Скользящие средние
            </h5>
            <div className="flex items-center text-sm md:text-lg font-serif ml-2">
              <MathText>reg_ma</MathText>
              <sub className="not-italic text-[0.6em] md:text-xs">k</sub>
              <span className="not-italic">(t)</span>
              <span className="mx-2">=</span>
              <Fraction num="1" den={<MathText>k</MathText>} />
              <Sigma top={<MathText>k-1</MathText>} bottom={<MathText>i=0</MathText>} />
              <MathText>registry</MathText>
              <span className="not-italic">(t - i)</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-xs md:text-sm text-gray-900 mb-2">Сезонность</h5>
            <div className="flex flex-col space-y-2 ml-2">
              <div className="flex items-center text-sm md:text-lg font-serif">
                <MathText>month_sin</MathText>
                <span className="mx-2">=</span>
                <span className="not-italic">sin</span>
                <span>(2π · month/12)</span>
              </div>
              <div className="flex items-center text-sm md:text-lg font-serif">
                <MathText>month_cos</MathText>
                <span className="mx-2">=</span>
                <span className="not-italic">cos</span>
                <span>(2π · month/12)</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-xs md:text-sm text-gray-900 mb-2">Тренд</h5>
            <div className="flex items-center text-sm md:text-lg font-serif ml-2">
              <MathText>trend(t)</MathText>
              <span className="mx-2">=</span>
              <MathText>registry(t)</MathText>
              <span className="mx-2">-</span>
              <MathText>registry(t - 1)</MathText>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h5 className="font-bold text-xs md:text-sm text-gray-900 mb-2">
              Прогноз смертности
            </h5>
            <div className="flex items-center text-sm md:text-lg font-serif ml-2">
              <span className="italic relative">
                y<span className="absolute -top-3 left-0.5 text-xs md:text-sm">^</span>
              </span>
              <span className="not-italic">(t + 1)</span>
              <span className="mx-2">=</span>
              <MathText>RF</MathText>
              <span className="not-italic">(X(t))</span>
            </div>
            <div className="mt-4 text-[10px] md:text-sm text-gray-600">
              <p>где:</p>
              <p>RF — обученный Random Forest,</p>
              <p>X(t) — набор признаков.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}