export const MapLegend = () => {
  const legendItems = [
    {
      color: 'bg-green-500',
      label: 'Низкий',
      range: '(<900)',
    },
    {
      color: 'bg-yellow-400',
      label: 'Средний',
      range: '(900-1700)',
    },
    {
      color: 'bg-red-500',
      label: 'Высокий',
      range: '(>1700)',
    },
  ];

  return (
    <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 p-2 md:p-3 rounded-md md:rounded-lg border bg-white/60 md:bg-white/50 backdrop-blur-sm md:backdrop-blur-md shadow-sm md:shadow">
      <div className="font-semibold text-[11px] md:text-sm text-[#1b1b1b] mb-1.5 md:mb-2.5">
        Легенда по кол-ву смертности
      </div>
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center mb-1.5 md:mb-2 last:mb-0">
          <span
            className={`w-3 h-3 md:w-3.5 md:h-3.5 ${item.color} inline-block rounded mr-2 md:mr-2.5 shadow-sm border border-gray-300 flex-shrink-0`}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] md:text-[11px] text-[#283353] font-semibold leading-tight truncate">{item.label} {item.range}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
