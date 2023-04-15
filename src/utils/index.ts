import { format } from 'date-fns'
import { th } from 'date-fns/esm/locale'

export const formatCurrency = (amount: number) => {
    return amount.toLocaleString("th-TH", {
        maximumFractionDigits: 4,
        minimumFractionDigits: 2,
    })
}
export const formatTime = (time: Date | number) => {
    return format(time, 'HH:mm:ss น.', {})
}

export const formatDate = (date: Date | number) => {
    return format(date, 'dd MMMM yyyy', {
        locale: th
    })
}

export const now = () => format(Date.now(), "yyyy-MM-dd")


