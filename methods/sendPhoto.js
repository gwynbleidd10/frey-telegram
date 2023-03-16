const FormData = require('form-data')
const string2fileStream = require('string-to-file-stream')

const { sendErrorMessage } = require('@/utils')

export const sendFile = async ({
    token,
    chat,
    filename = 'Наименование файла',
    file,
    message
}) => {
    let result = false
    let formData = new FormData()

    formData.append("chat_id", chat)
    formData.append("parse_mode", "html")
    formData.append("photo", string2fileStream(file, { path: filename }))

    if (message) {
        formData.append("caption", message)
    }

    try {
        let result = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData
        })
        result = await result.json()
        result = result.ok
    } catch (err) {
        await sendErrorMessage({ path: 'utils/telegram/methods/sendPhoto', message: 'Ошибка отправки фото', stack: err.stack, send: false, log: true })
    }

    return result
}