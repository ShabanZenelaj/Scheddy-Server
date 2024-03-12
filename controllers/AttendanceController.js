import Attendance from "../models/AttendanceModel.js";

const GetList = async (req, res, next) => {
    try {
        let results = await Attendance.find({userId: req.userData.id}, {}, { sort: { _id: -1 }}).select({ date: 1, time: 1 });

        console.log(results)

        let toReturn = results.map((item) => {
            let total = 0;
            item.time.forEach((time) => {
                if(time.end === undefined){
                    return;
                }
                const start = time.start;
                const end = time.end;

                const [hours1, minutes1] = start.split(':').map(Number);
                const [hours2, minutes2] = end.split(':').map(Number);

                const differenceInMinutes = (hours2 - hours1) * 60 + (minutes2 - minutes1);

                const differenceInHours = differenceInMinutes / 60;

                total += differenceInHours;
            })
            return {
                date: item.date,
                time: item.time,
                total: total
            }
        });


        res.status(200).send(toReturn);
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};

const PunchInOut = async (req, res, next) => {
    try {
        let latestDocument = await Attendance.findOne({userId: req.userData.id}, {}, { sort: { _id: -1 }, limit: 1 }).select({ date: 1, time: 1, userId: 1 });

        const dateObj = new Date();
        const timezoneOffset = dateObj.getTimezoneOffset();
        dateObj.setUTCMinutes(dateObj.getUTCMinutes() - timezoneOffset);

        const date =
            dateObj.getUTCFullYear() +
            '-' +
            ('0' + (dateObj.getUTCMonth() + 1)).slice(-2) +
            '-' +
            ('0' + dateObj.getUTCDate()).slice(-2);

        const time =
            ('0' + dateObj.getUTCHours()).slice(-2) +
            ':' +
            ('0' + dateObj.getUTCMinutes()).slice(-2);

        let newDocument = undefined;
        if(latestDocument && latestDocument.date === date){
            if(latestDocument.time.length > 0){
                const index = latestDocument.time.length - 1;
                const latestTime = latestDocument.time[index];
                if(latestTime.end !== undefined){
                    latestDocument.time.push({ start: time });
                } else {
                    latestDocument.time[index].end = time;
                }
            } else {
                latestDocument.time.push({ start: time });
            }
            newDocument = latestDocument;
        } else {
            newDocument = {
                date: date,
                time: [
                    {
                        start: time
                    }
                ],
                userId: req.userData.id
            };
        }

        if(newDocument === undefined){
            throw new Error("New document is not valid");
        }

        if(newDocument._id === undefined){
            await Attendance.create(newDocument);
        } else {
            await Attendance.replaceOne({ _id: newDocument._id }, newDocument);
        }
        res.status(200).send(newDocument);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding record");
    }
}

export {GetList, PunchInOut};