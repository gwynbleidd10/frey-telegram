const FormData = require('form-data')
const string2fileStream = require('string-to-file-stream')

export const sendFile = async ({
    token,
    chat,
    filename = 'Наименование файла',
    file,
}) => {
    let result = false
    let formData = new FormData()

    formData.append("chat_id", chat)
    formData.append("document", string2fileStream(file, { path: filename }))

    let send = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        body: formData
    })

    if (send.status == 200) {
        // send = await send.json()
        result = true
    }

    return result
}