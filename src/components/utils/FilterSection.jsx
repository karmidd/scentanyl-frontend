import GenderFilterButtons from "./buttons/GenderFilterButtons.jsx";
import YearFilterButton from "./buttons/YearFilterButton.jsx";

export default function FilterSection({genderFilterData, yearFilterData}) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Gender Filter */}
            <div className="flex justify-center">
                <GenderFilterButtons onClick={genderFilterData.onClick} selectedGender={genderFilterData.selectedGender}/>
            </div>

            {/* Year Filter - Below Gender */}
            <div className="flex justify-center">
                <YearFilterButton
                    onYearRangeChange={yearFilterData.onYearRangeChange}
                    onSortChange={yearFilterData.onSortChange}
                    minYear={yearFilterData.minYear}
                    maxYear={yearFilterData.maxYear}
                />
            </div>
        </div>
    );
}