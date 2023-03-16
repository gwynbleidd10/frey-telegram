export const sendMessage = async ({
    token,
    chat,
    text,
    apiUrl = 'https://api.telegram.org',
    parse_mode = 'html',
    disable_web_page_preview = true,
    resize_keyboard = true,
    one_time_keyboard = true,
    inline_keyboard = [],
    keyboard = [],
}) => {
    const url = `${apiUrl}/bot${token}/sendMessage`

    let result = false

    let send = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parse_mode,
            disable_web_page_preview,
            chat_id: chat,
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

    if (send.status == 200) {
        result = true
    }

    return result
}