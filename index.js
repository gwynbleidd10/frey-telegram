const { Tg_chats, Tg_tokens } = require('@/models/pg/10.18.100.65/system')

// const { sendErrorMessage } = require('@/utils')
const { responseMessage, sendFile } = require('./methods')

const path = 'utils/telegram'

/**
 * 
 * @param {Object} token
 * @param {Object} type
 * @param {Object} sendMessage 
 * @returns 
 */
const Telegram = async ({
    bot,
    chat = null,
}) => {
    let globalToken = await getToken(bot) || null,
        globalChat = await getChat(chat) || null,
        response = { status: true, message: null },
        header = {
            parse_mode: 'html',
            disable_web_page_preview: true,
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
        const url = `https://api.telegram.org/bot${newToken}/sendMessage`

        let result = { status: false, message: null }

        let send = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...header,
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

    if (globalToken) {
        return {
            sendMessage
        }
    }
    else {

    }

    // return response

    // let requestType = await getType(request) || null,
    //     isCommand = false,
    //     command = null

    // if (requestType == 'message') {
    //     let check = await checkCommand(request.message.text)
    //     isCommand = check.isCommand
    //     command = check.command
    // }

    // if (requestType == 'document') {
    //     let check = await checkCommand(request.message.caption)
    //     isCommand = check.isCommand
    //     command = check.command
    // }

    // return {
    //     token: botToken,
    //     chat: botChat,
    //     type: requestType,
    //     isCommand,
    //     command,
    //     request,
    //     sendMessage,
    //     responseMessage,
    //     sendFile,
    // }
}

const getToken = async (bot) => {
    let result = null

    try {
        let getToken = await Tg_tokens.findOne({
            raw: true,
            where: {
                name: bot
            }
        })

        if (getToken) {
            result = getToken.token
        }
    } catch (err) {
        // await sendErrorMessage({ path, message: 'Ошибка получения токена', stack: err.stack, send: false, log: true })
    }

    return result
}

const getChat = async (chat) => {
    let result = null

    try {
        let getChat = await Tg_chats.findOne({
            raw: true,
            where: {
                name: chat
            }
        })

        if (getChat) {
            result = getChat.chat
        }
    } catch (err) {
        // await sendErrorMessage({ path, message: 'Ошибка получения чата', stack: err.stack, send: false, log: true })
    }

    return result
}

const getType = async (request) => {
    let type = null

    if (request?.message) {
        let message = request?.message
        if (message?.document) {
            type = 'document'
        }

        if (message?.text) {
            type = 'message'
        }
    }

    if (request?.callback_query) {
        type = 'callback'
    }

    return type
}

const checkCommand = async (text) => {
    const reg = /^\/[a-zA-Zа-яА-Я0-9_]+(\ .+)*$/gmi,
        regInline = /^\/[a-zA-Zа-яА-Я0-9_]+(\@.+)+$/gmi

    let isCommand = false,
        command = null

    if (reg.test(text)) {
        isCommand = true
        command = text.split(' ')[0].split('/')[1]
    }

    if (regInline.test(text)) {
        isCommand = true
        command = text.split('@')[0].split('/')[1]
    }

    return {
        isCommand,
        command
    }
}

const webhookResponse = async () => {

}

module.exports = {
    Telegram
}