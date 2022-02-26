const utils = {
    // YYYY-MM-DDTHH:MM:SS.SSS -> YYYY년 MM월 DD일 HH:MM:SS
    getDateFormat : (date) => {
        let newDate = date.substr(0,4) + '.' + date.substr(5,2) + '.' + date.substr(8,2) + ' ' + date.substr(11,5)
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