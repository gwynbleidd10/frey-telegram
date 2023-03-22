/**
 * 
 * @param {Object} {token = null, chat = null, message = null} 
 * @returns 
 */
const Telegram = async ({
    token: globalToken = null,
    chat: globalChat = null,
    message: globalMessage = null,
}) => {
    const isCommand = async (options = {
        message: globalMessage.text
    }) => {
        const newMessage = options.message

        if (newMessage) {
            const reg = /^\/.+$/gmi

            if (reg.test(newMessage)) {
                let messageArr = newMessage.split(' ')
                return { command: messageArr[0], text: messageArr.slice(1).join(' ') }
            }
            else {
                return false
            }
        }
        else {
            return 'Отсутствует поле MESSAGE'
        }
    }

    const sendMessage = async ({
        token: newToken = globalToken,
        chat: newChat = globalChat,
        text,
        resize_keyboard = true,
        one_time_keyboard = true,
        inline_keyboard = [],
        keyboard = [],
    }) => {
        if (newToken && newChat) {
            const url = `https://api.telegram.org/bot${newToken}/sendMessage`

            let result = { status: false, message: null }

            let send = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parse_mode: 'html',
                    disable_web_page_preview: true,
                    chat_id: newChat,
                    text,
                    reply_markup: {
                        inline_keyboard: [
                            [...inline_keyboard]
                        ],
                        keyboard: [
                            ...keyboard
                        ],
                        resize_keyboard,
                        one_time_keyboard,
                    }
                })
            })

            send = await send.json()

            if (send.ok)
                result = result?.ok

            return result
        }
        else {
            return { status: false, message: 'Необходимо указать TOKEN и CHAT бота' }
        }

    }

    return {
        token: globalToken,
        chat: globalChat,
        message: globalMessage,
        isCommand,
        sendMessage,
    }
}

module.exports = {
    Telegram
}