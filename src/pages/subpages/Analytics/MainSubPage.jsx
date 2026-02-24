'use client';

import DeathByYearLineGraph from "../../../components/AnalyticsPage/MainSubPage/DeathByYearLineGraph"
import MkbBarChart from "../../../components/AnalyticsPage/MainSubPage/MkbBarChart"
import DeathCauseBarChart from "../../../components/AnalyticsPage/MainSubPage/DeathCauseBarChart"
import DeathMoBarChart from "../../../components/AnalyticsPage/MainSubPage/DeathMoBarChart"
import GenderBarChart from "../../../components/AnalyticsPage/MainSubPage/GenderBarChart"
import SeasonsBarChart from "../../../components/AnalyticsPage/MainSubPage/SeasonsBarChart"
import CauseByYearBarChart from "../../../components/AnalyticsPage/MainSubPage/CauseByYearBarChart"

export default function MainSubPage({ selectedYear, selectedMonth }) { 

    return (
        <div className="flex flex-col gap-4 pb-4 lg:pb-0 h-auto lg:h-full">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:h-[45%] shrink-0">
                <div className="h-80 lg:h-auto lg:min-h-0 w-full">
                    <DeathByYearLineGraph />
                </div>
                
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 h-auto lg:h-full">
                    <div className="h-80 lg:h-auto lg:min-h-0 w-full">
                        <GenderBarChart year={selectedYear} month={selectedMonth} />
                    </div>
                    <div className="h-80 lg:h-auto lg:min-h-0 w-full">
                        <SeasonsBarChart year={selectedYear} month={selectedMonth} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-1 md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:h-[50%] shrink-0">
                <div className="h-96 lg:h-auto lg:min-h-0 w-full">
                    <MkbBarChart year={selectedYear} month={selectedMonth} />
                </div>
                <div className="h-96 lg:h-auto lg:min-h-0 w-full">
                    <DeathCauseBarChart year={selectedYear} month={selectedMonth} />
                </div>
                <div className="h-96 lg:h-auto lg:min-h-0 w-full">
                    <DeathMoBarChart year={selectedYear} month={selectedMonth} />
                </div>
                <div className="h-96 lg:h-auto lg:min-h-0 w-full">
                    <CauseByYearBarChart year={selectedYear} month={selectedMonth} />
                </div>
            </div>
        </div>
    )
}