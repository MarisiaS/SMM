import { swimMeetData } from '/TestData/SwimMeetData.jsx';
import SwimMeetTable from './SwimMeetTable';
import MyButton from '../forms/MyButton';

const SwimMeet = () => {
    const data = swimMeetData;
    return (
        <div>
            <MyButton 
                label={"Create new swim meet"}
            />
            <SwimMeetTable data={data} />
        </div>
    )
}

export default SwimMeet