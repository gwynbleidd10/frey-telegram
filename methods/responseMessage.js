export const responseMessage = async ({
    chat,
    text,
    parse_mode = 'html',
    disable_web_page_preview = true,
    resize_keyboard = true,
    one_time_keyboard = true,
    inline_keyboard = [],
    keyboard = [],
}) => {
    return {
        method: "sendMessage",
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
    }
}