const utils = {
    // YYYY-MM-DDTHH:MM:SS.SSS -> YYYY년 MM월 DD일 HH:MM:SS
    getDateFormat : (date) => {
        let newDate = date.substr(0,4) + '년 ' + date.substr(5,2) + '월 ' + date.substr(8,2) + '일 ' 
        + date.substr(11,8)
        return newDate
    },
    isEmpty : (input) => {
        if (input === undefined) return true
        else if (input === '') return true
        else if (input.length === 0) return true
        return false
    }
}

export default utils