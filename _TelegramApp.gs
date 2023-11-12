/**
 * A class representing the Telegram API wrapper.
 * @class
 * @param {string} token - The authentication token for the Telegram bot.
 * @param {boolean} [logging=false] - Whether or not to log API responses.
 * @property {string} token - The authentication token for the Telegram bot.
 * @property {boolean} logging - Whether or not to log API responses.
 * @property {string} apiVersion - The version of the Telegram API to use.
 * @property {function} Type - A factory function for creating new Type objects.
 * @property {function} Utils - A factory function for creating new Utils objects.
 * @property {function} apiCall - A function for making API requests to the Telegram API.
 */

class TelegramApp {
    constructor(token, logging) {
        this.token = token;
        this.logging = logging || false;
        this.apiVersion = '6.6';
        this.Type = () => new Type();
        this.Utils = () => new Utils();

        /**
         * Makes an API request to the Telegram API.
         * @function
         * @param {string} token - The authentication token for the Telegram bot.
         * @param {string} method - The Telegram API method to call.
         * @param {object} [data] - The data to include in the API request.
         * @returns {object} The result of the API request, if successful.
         */

        this.apiCall = (token, method, data) => {
            const url = `https://api.telegram.org/bot${token}/${method}`;
            const options = {
                muteHttpExceptions: true,
                method: 'POST',
                contentType: 'application/json',
            };
            if (data != null) {
                options.payload = JSON.stringify(data);
            }
            if (this.logging) {
                Logger.log(options);
            }
            const response = UrlFetchApp.fetch(url, options);
            if (this.logging) {
                Logger.log(response);
            }
            const json = JSON.parse(response);
            if (json.result) {
                return json.result;
            } else {
                Logger.log(response);
                return;
            }
        };
    }

    // Getting updates 

    /**
     * Retrieves updates using the Telegram API.
     * @return {Object[]} An array of update objects.
     */
    async getUpdates() {
        return this.apiCall(this.token, 'getUpdates').map(function (element) {
            return this.Type().Update(element);
        });
    }

    /**
     * @method setWebhook
     * @param {string} url - HTTPS url to send updates to. Use an empty string to remove webhook integration.
     * @param {InputFile | string} [certificate] - Upload your public key certificate so that the root certificate in use can be checked. Optional if self-signed.
     * @param {string} [ip_address] - Optional fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS.
     * @param {number} [max_connections] - Optional maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40.
     * @param {string[]} [allowed_updates] - Optional list the types of updates you want your bot to receive.
     * @param {boolean} [drop_pending_updates] - Optional flag to drop all pending updates.
     * @param {string} [secret_token] - Optional secret token to be sent in the header "X-Telegram-Bot-Api-Secret-Token" in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, _, and - are allowed.
     * @returns {Object} - Object representing the result of the API call.
     * @throws {Error} - If `url` is not provided.
     */
    async setWebhook(params = { url, certificate, ip_address, max_connections, allowed_updates, drop_pending_updates, secret_token }) {
        if (!params.url) {
            throw new Error('url for setWebhook method is missing');
        }
        return this.apiCall(this.token, 'setWebhook', params);
    }

    /**
     * @method deleteWebhook
     * Deletes the current webhook.
     * @param {Object} [params] - The parameters to pass to the API request.
     * @param {boolean} [params.drop_pending_updates] - Optional flag to drop all pending updates.
     * @returns {boolean} - Returns true on success.
     * @throws {Error} - If the `params` argument is not provided.
     */
    async deleteWebhook(params = { drop_pending_updates }) {
        if (params) {
            return this.apiCall(this.token, 'deleteWebhook', params);
        } else {
            throw new Error('params argument for deleteWebhook method is missing');
        }
    }

    /**
     * @method getWebhookInfo
     * Retrieves information about the current webhook.
     * @returns {Object} - The webhook information.
     */
    async getWebhookInfo() {
        return this.Type().WebhookInfo(
            this.apiCall(this.token, 'getWebhookInfo')
        );
    }

    // Available methods

    /**
     * @method getMe
     * Retrieves information about the bot.
     * @returns {Object} - Returns basic information about the bot in the form of a User object.
     */
    async getMe() {
        return this.Type().User(
            this.apiCall(this.token, 'getMe')
        );
    }

    /**
     * Logs the bot out by calling the API's `logOut` method.
     * @returns {boolean} Returns True on success.
     */
    async logOut() {
        return this.apiCall(this.token, 'logOut');
    }

    /**
     * Use this method to close the bot instance before moving it from one local server to another. 
     * @returns {boolean} Returns True on success.
     */
    async close() {
        return this.apiCall(this.token, 'close');
    }

    /**
     * Sends a message with the given parameters to a chat.
     * @method sendMessage
     * @param {number} chat_id - The ID of the chat where the message should be sent.
     * @param {number} [message_thread_id] - The ID of the message thread.
     * @param {string} text - The text of the message.
     * @param {string} [parse_mode] - The mode for parsing entities in the message text.
     * @param {Object[]} [entities] - An array of message entities.
     * @param {boolean} [disable_web_page_preview] - Whether to disable web page previews for links in the message.
     * @param {boolean} [disable_notification] - Whether to disable notifications for the message.
     * @param {boolean} [protect_content] - Whether to protect the content of the message.
     * @param {number} [reply_to_message_id] - The ID of the message being replied to.
     * @param {boolean} [allow_sending_without_reply] - Whether to allow sending the message without a reply.
     * @param {Object} [reply_markup] - The reply markup for the message.
     * @returns {Message} A message object.
     */
    async sendMessage(params = { chat_id, message_thread_id, text, parse_mode, entities, disable_web_page_preview, disable_notification, protect_content, reply_to_message_id, allow_sending_without_reply, reply_markup }) {
        if (!params.chat_id) {
            throw new Error('chat_id for sendMessage method is missing');
        }
        if (!params.text) {
            throw new Error('text for sendMessage method is missing');
        }
        return this.Type().message(
            this.apiCall(this.token, 'sendMessage', params)
        );
    }

    /**
     * Forward a message from one chat to another.
     * @param {Object} params - Parameters for forwarding the message.
     * @param {number} params.chat_id - The ID of the chat to forward the message to.
     * @param {number} params.message_thread_id - The ID of the message thread to forward.
     * @param {number} params.from_chat_id - The ID of the chat the message is being forwarded from.
     * @param {boolean} [params.disable_notification=false] - Whether to disable notifications for the forwarded message.
     * @param {boolean} [params.protect_content=false] - Whether to protect the forwarded message's content from being forwarded again.
     * @param {number} [params.message_id] - The ID of the message to forward, if known.
     * @returns {Object} - The forwarded message.
     */
    async forwardMessage(params = {
        chat_id,
        message_thread_id,
        from_chat_id,
        disable_notification,
        protect_content,
        message_id
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'forwardMessage', params)
        );
    }

    /**
     * Copies a message to a different chat or channel.
     * @param {Object} params - The parameters for the message copy operation.
     * @param {number} params.chat_id - The ID of the chat where the message will be copied to.
     * @param {number} params.message_thread_id - The ID of the thread where the message will be copied to.
     * @param {number} params.from_chat_id - The ID of the chat where the original message was sent.
     * @param {number} params.message_id - The ID of the original message to be copied.
     * @param {string} params.caption - The caption to be sent with the copied message.
     * @param {string} params.parse_mode - The parsing mode for the caption.
     * @param {Array} params.caption_entities - An array of special entities in the caption, such as usernames or hashtags.
     * @param {boolean} params.disable_notification - Whether to disable notifications for the copied message.
     * @param {boolean} params.protect_content - Whether to protect the copied content with a password.
     * @param {number} params.reply_to_message_id - The ID of the message to reply to with the copied message.
     * @param {boolean} params.allow_sending_without_reply - Whether to allow sending the copied message without a reply.
     * @param {Object} params.reply_markup - The reply markup for the copied message.
     * @returns {Object} - The message ID of the copied message.
     */
    async copyMessage(params = {
        chat_id,
        message_thread_id,
        from_chat_id,
        message_id,
        caption,
        parse_mode,
        caption_entities,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().MessageId(
            this.apiCall(this.token, 'copyMessage', params)
        );
    }

    /**
     * Sends a photo message to a chat.
     * @param {Object} [params] - The parameters object.
     * @param {number|string} [params.chat_id] - The chat ID where the photo will be sent.
     * @param {number} [params.message_thread_id] - The ID of the message thread.
     * @param {string|ReadableStream|Buffer} [params.photo] - The photo to send. Can be a file ID, a ReadableStream or a Buffer.
     * @param {string} [params.caption] - The caption for the photo.
     * @param {string} [params.parse_mode] - The parse mode to use for the caption.
     * @param {Object[]} [params.caption_entities] - List of special entities that appear in the caption.
     * @param {boolean} [params.has_spoiler] - Whether the photo contains a spoiler.
     * @param {boolean} [params.disable_notification] - Whether to disable the notification for the message.
     * @param {boolean} [params.protect_content] - Whether the content should be protected.
     * @param {number} [params.reply_to_message_id] - The ID of the message to reply to.
     * @param {boolean} [params.allow_sending_without_reply] - Whether to allow sending the message without a reply.
     * @param {Object} [params.reply_markup] - The reply markup for the message.
     * @returns {Object} - On success, the sent Message is returned.
     */
    async sendPhoto(params = {
        chat_id,
        message_thread_id,
        photo,
        caption,
        parse_mode,
        caption_entities,
        has_spoiler,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendPhoto', params)
        );
    }

    /**
    * Sends an audio message with parameters supplied as an object
    * @param {Object} params - An object with the parameters for sending an audio
    * @param {String} params.chat_id - Unique identifier of the chat 
    * @param {String} params.message_thread_id - Unique identifier of the thread 
    * @param {String|InputFile} params.audio - Audio file 
    * @param {String} params.caption - Audio message caption, 0-1024 characters  
    * @param {String} params.parse_mode - Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption 
    * @param {Array} params.caption_entities - Array of InlineKeyboardMarkup objects 
    * @param {Integer} params.duration - Duration of the audio in seconds 
    * @param {String} params.performer - Performer 
    * @param {String} params.title - Track name 
    * @param {String|InputFile} params.thumbnail - Thumbnail of the audio file 
    * @param {boolean} params.disable_notification - Sends the message silently. 
    * @param {boolean} params.protect_content - True, if content should be protected 
    * @param {String} params.reply_to_message_id - If the message is a reply, ID of the original message 
    * @param {boolean} params.allow_sending_without_reply - Pass True, if the message should be sent even if the specified replied-to message is not found 
    * @param {Object} params.reply_markup - Keyboard of InlineKeyboardMarkup type
    * @return {Message} - Message object
    */
    async sendAudio(params = {
        chat_id,
        message_thread_id,
        audio,
        caption,
        parse_mode,
        caption_entities,
        duration,
        performer,
        title,
        thumbnail,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendAudio', params)
        );
    }

    /**
     * Sends a document
     * @param {Object} params - Object containing all the parameters
     * @param {number} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param {string} params.message_thread_id - Identifier of the message thread in which the messaging participants are involved 
     * @param {string} params.document - File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet
     * @param {string} params.thumbnail - Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side
     * @param {string} params.caption - Optional. Document caption (may also be used when resending documents by file_id)
     * @param {string} params.parse_mode - Optional. Mode for parsing entities in the document caption. See formatting options for more details.
     * @param {Object[]} params.caption_entities - Optional. List of special entities that appear in the caption, which can be specified instead of “parse_mode”
     * @param {boolean} params.disable_content_type_detection - Optional. Disables automatic server-side content type detection for files uploaded using multipart/form-data
     * @param {boolean} params.disable_notification - Optional. Sends the message silently. Users will receive a notification with no sound
     * @param {boolean} params.protect_content -Optional. Use this parameter if you want Telegram to send a message as a Markdown or HTML
     * @param {number} params.reply_to_message_id - Optional. If the message is a reply, ID of the original message
     * @param {boolean} params.allow_sending_without_reply - Optional. Pass True, if the message should be sent even if the specified replied-to message is not found
     * @param {Object} params.reply_markup - Optional. Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user    
     * @returns {Message} Data for a new sent message
     */
    async sendDocument(params = {
        chat_id,
        message_thread_id,
        document,
        thumbnail,
        caption,
        parse_mode,
        caption_entities,
        disable_content_type_detection,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendDocument', params)
        );
    }

    /**
      * Sends a video to the specified chat.
      * @param {Object} params - The request parameters 
      * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel
      * @param {String} params.message_thread_id - The message thread identifier of the previous sent message.
      * @param {unit8Array} params.video  - Video file
      * @param {Number} [params.duration] - Duration of the video in seconds 
      * @param {Number} [params.width] - Video width 
      * @param {Number} [params.height] - Video height 
      * @param {Object|String} [params.thumbnail] - Video thumbnail 
      * @param {String} [params.caption] - Video caption 
      * @param {String} [params.parse_mode] - The parse mode used for the caption 
      * @param {Array} [params.caption_entities] - Additional caption formatting entities
      * @param {Boolean} [params.has_spoiler] - Boolean value to mark content that contains spoilers
      * @param {Boolean} [params.supports_streaming] - Boolean indicating if the video supports streaming
      * @param {Boolean} [params.disable_notification] - Sends the message silently. Users will receive a notification with no sound.
      * @param {Boolean} [params.protect_content] - Boolean value disallow users to capture and share the video  
      * @param {Number} [params.reply_to_message_id] - If the message is a reply, ID of the original message
      * @param {Boolean} [params.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found
      * @param {Array} [params.reply_markup] - Additional interface options 
      * @returns {Object} Message
     */
    async sendVideo(params = {
        chat_id,
        message_thread_id,
        video,
        duration,
        width,
        height,
        thumbnail,
        caption,
        parse_mode,
        caption_entities,
        has_spoiler,
        supports_streaming,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendVideo', params)
        );
    }

    /**
     * Sends an animation to chat.
     * @param {Object} [params] The parameters to send along with the animation.
     * @param {number} [params.chat_id] Unique identifier for the target chat.
     * @param {string} [params.message_thread_id] The identifier of the message thread which sender want to send animation to.
     * @param {InputFile} [params.animation] Animation to send. You can either pass a file_id as String to resend an animation that is already on the Telegram servers, or upload a new animation file using multipart/form-data
     * @param {number} [params.duration] Duration of sent animation in seconds
     * @param {number} [params.width] Animation width
     * @param {number} [params.height] Animation height 
     * @param {InputFile} [params.thumbnail] Thumbnail of the animation file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail‘s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can’t be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
     * @param {string} [params.caption] Animation caption (may also be used when resending animation by file_id), 0-1024 characters
     * @param {string} [params.parse_mode] Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption.
     * @param {MessageEntity} [params.caption_entities] List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param {boolean} [params.has_spoiler] Pass True, if the message should be marked as a warning
     * @param {boolean} [params.disable_notification] Sends the message silently. Users will receive a notification with no sound.
     * @param {boolean} [params.protect_content] Pass True, if you want to upload animation which must be treated as safe by the clients.
     * @param {number} [params.reply_to_message_id] If the message is a reply, ID of the original message
     * @param {boolean} [params.allow_sending_without_reply] Pass True, if the message should be sent even if the specified replied-to message is not found
     * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply} [params.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     * @returns {Message} On success, the sent Message is returned.
     */
    async sendAnimation(params = {
        chat_id,
        message_thread_id,
        animation,
        duration,
        width,
        height,
        thumbnail,
        caption,
        parse_mode,
        caption_entities,
        has_spoiler,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendAnimation', params)
        );
    }

    /**
     * Sends an audio message using a voice.
     * @param { Object } [params] - Parameters for the request
     * @param { Number } [params.chat_id] - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param { Number } [params.message_thread_id] - Identifier of the message to reply to.
     * @param { String } params.voice - Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data
     * @param { String } [params.caption] - Voice message caption, 0-1024 characters
     * @param { String } [params.parse_mode] - Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption. 
     * @param { Array<objects> } [params.caption_entities] - List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param { Number } [params.duration] - Duration of the voice message in seconds.
     * @param { Boolean } [params.disable_notification] - Sends the message silently. Users will receive a notification with no sound.
     * @param { String } [params.protect_content] - Pass True, to enable server-side content notification protection for this message.
     * @param { Number } [params.reply_to_message_id] - If the message is a reply, ID of the original message
     * @param { Boolean } [params.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found
     * @param { Object } [params.reply_markup] - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     * @returns { Message } - Returns the sent Message on success
     */
    async sendVoice(params = {
        chat_id,
        message_thread_id,
        voice,
        caption,
        parse_mode,
        caption_entities,
        duration,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendVoice', params)
        );
    }

    /**
     * Sends a video note to the specified chat.
     * @param {object} params - An object containing the necessary parameters to send a video note.
     * @param {number|string} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {string} params.message_thread_id - Identifier of the message thread to send the video note.
     * @param {string} params.video_note - Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. 
     * @param {number} params.duration - Duration of sent video in seconds.
     * @param {number} params.length - Video width and height.
     * @param {string} params.thumbnail - Thumbnail of the file sent. The thumbnail should be in JPEG format and less than 200 kB in size. 
     * @param {boolean} params.disable_notification - Sends the message silently. Users will receive a notification with no sound.
     * @param {boolean} params.protect_content - Disables content sharing in the message thread.
     * @param {number} params.reply_to_message_id - If the message is a reply, ID of the original message.
     * @param {boolean} params.allow_sending_without_reply - Pass True, if the message should be sent even if the specified replied-to message is not found. 
     * @param {object} params.reply_markup - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, 
     * @return {Message} - Sent message object.
     */
    async sendVideoNote(params = {
        chat_id,
        message_thread_id,
        video_note,
        duration,
        length,
        thumbnail,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendVideoNote', params)
        );
    }

    /**
     * Send a group of media files.
     * @param {Object} params - Parameters for media group sending request. 
     * @param {Number|String} params.chat_id - Unique identifier for the target chat.
     * @param {String} params.message_thread_id - thread identifier that mediagroup belongs to.
     * @param {Object} params.media - An array containing media objects.
     * @param {Boolean} [params.disable_notification] - Sends the message silently.
     * @param {Boolean} [params.protect_content] - Pass True, if messages should be sent in media group should be protected.
     * @param {Number} [params.reply_to_message_id] - If the message is a reply, ID of the original message.
     * @param {Boolean} [params.allow_sending_without_reply] - Pass True, if messages should be sent in media group should be sent without mention.
     * @return {Message} - A message with its fields filled.
    */
    async sendMediaGroup(params = {
        chat_id,
        message_thread_id,
        media,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendMediaGroup', params)
        );
    }

    /**
     * Send a location
     * @param {Object=} params Object with optional params.
     * @prop {Number} params.chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @prop {String} params.message_thread_id Identifies the message thread the message will be sent in
     * @prop {Number} params.latitude Latitude of the location
     * @prop {Number} params.longitude Longitude of the location
     * @prop {Number} params.horizontal_accuracy The radius of uncertainty for the location, measured in meters
     * @prop {Number} params.live_period Period in seconds for which the location will be updated (see Live Locations)
     * @prop {Number} params.heading Direction in which the user is moving, in degrees
     * @prop {Number} params.proximity_alert_radius Maximum distance for proximity alerts about the user, in meters
     * @prop {Boolean} params.disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @prop {Boolean} params.protect_content Pass True, if content should be protected
     * @prop {Number} params.reply_to_message_id If the message is a reply, ID of the original message
     * @prop {Boolean} params.allow_sending_without_reply Pass True, if the message should be sent even if the specified replied-to message is not found
     * @prop {Object} params.reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove keyboard or to force a reply from the user.
     * @returns {Message} - A message with its fields filled.
     */
    async sendLocation(params = {
        chat_id,
        message_thread_id,
        latitude,
        longitude,
        horizontal_accuracy,
        live_period,
        heading,
        proximity_alert_radius,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendLocation', params)
        );
    }

    /**
     * Sends a venue to a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {String} params.message_thread_id - Identifier of the message thread the message belongs to.
     * @param {Number} params.latitude - Latitude of the venue.
     * @param {Number} params.longitude - Longitude of the venue.
     * @param {String} params.title - Name of the venue.
     * @param {String} params.address - Address of the venue.
     * @param {String} params.foursquare_id - Foursquare identifier of the venue.
     * @param {String} params.foursquare_type - Foursquare type of the venue.
     * @param {String} params.google_place_id - Google Places identifier of the venue.
     * @param {String} params.google_place_type - Google Places type of the venue.
     * @param {Boolean} params.disable_notification - Sends the message silently. Users will receive a notification with no sound.
     * @param {Boolean} params.protect_content - Pass True, if the message should be sent with content protection.
     * @param {Number} params.reply_to_message_id - If the message is a reply, ID of the original message.
     * @param {Boolean} params.allow_sending_without_reply - Pass True, if the message should be sent even if the specified replied-to message is not found.
     * @param {Object} params.reply_markup - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     * @return {Message} - On success, the sent Message is returned.
     */
    async sendVenue(params = {
        chat_id,
        message_thread_id,
        latitude,
        longitude,
        title,
        address,
        foursquare_id,
        foursquare_type,
        google_place_id,
        google_place_type,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendVenue', params)
        );
    }

    /**
     * Sends a contact to the specified chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {Number} [params.message_thread_id] - Identifier of the message thread the contact message belongs to.
     * @param {String} params.phone_number - Contact's phone number.
     * @param {String} params.first_name - Contact's first name.
     * @param {String} [params.last_name] - Contact's last name.
     * @param {String} [params.vcard] - Additional data about the contact in the form of a vCard, 0-2048 bytes.
     * @param {Boolean} [params.disable_notification] - Sends the message silently. Users will receive a notification with no sound.
     * @param {Boolean} [params.protect_content] - Pass True, if the message should be sent with content protection.
     * @param {Number} [params.reply_to_message_id] - If the message is a reply, ID of the original message.
     * @param {Boolean} [params.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found.
     * @param {Object} [params.reply_markup] - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     * @returns {Message} - On success, the sent Message is returned.
     */
    async sendContact(params = {
        chat_id,
        message_thread_id,
        phone_number,
        first_name,
        last_name,
        vcard,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendContact', params)
        );
    }


    /**
     * Sends a poll to a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {Number} [params.message_thread_id] - Identifier of the message to reply to or 0.
     * @param {String} params.question - Poll question, 1-255 characters.
     * @param {Array} params.options - List of answer options, 2-10 strings 1-100 characters each.
     * @param {Boolean} [params.is_anonymous] - True, if the poll needs to be anonymous, defaults to True.
     * @param {String} [params.type] - Poll type, “quiz” or “regular”, defaults to “regular”.
     * @param {Boolean} [params.allows_multiple_answers] - True, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to False.
     * @param {Number} [params.correct_option_id] - 0-based identifier of the correct answer option, required for polls in quiz mode.
     * @param {String} [params.explanation] - Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing.
     * @param {String} [params.explanation_parse_mode] - Mode for parsing entities in the explanation.
     * @param {Array} [params.explanation_entities] - List of special entities that appear in the explanation, which can be specified instead of parse_mode.
     * @param {Number} [params.open_period] - Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with close_date.
     * @param {Number} [params.close_date] - Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with open_period.
     * @param {Boolean} [params.is_closed] - Pass True, if the poll needs to be immediately closed. This can be useful for poll preview.
     * @param {Boolean} [params.disable_notification] - Sends the message silently. Users will receive a notification with no sound.
     * @param {Boolean} [params.protect_content] - Pass True, if the message should be sent with content protection.
     * @param {Number} [params.reply_to_message_id] - If the message is a reply, ID of the original message.
     * @param {Boolean} [params.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found.
     * @param {Object} [params.reply_markup] - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     * @returns {Message} - On success, the sent Message is returned.
     */
    async sendPoll(params = {
        chat_id,
        message_thread_id,
        question,
        options,
        is_anonymous,
        type,
        allows_multiple_answers,
        correct_option_id,
        explanation,
        explanation_parse_mode,
        explanation_entities,
        open_period,
        close_date,
        is_closed,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendPoll', params)
        );
    }

    /**
     * Sends a dice message to the specified chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel.
     * @param {String} [params.message_thread_id] - Identifier of the message thread the dice message belongs to.
     * @param {String} [params.emoji] - Emoji on which the dice throw animation is based. Currently, must be one of “🎲”, “🎯”, or “🏀”. Defaults to “🎲”.
     * @param {Boolean} [params.disable_notification] - Sends the message silently. Users will receive a notification with no sound.
     * @param {Boolean} [params.protect_content] - Disables link previews for links in this message.
     * @param {Number} [params.reply_to_message_id] - If the message is a reply, ID of the original message.
     * @param {Boolean} [params.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found.
     * @param {Object} [params.reply_markup] - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     * @returns {Message} - On success, the sent Message is returned.
     */
    async sendDice(params = {
        chat_id,
        message_thread_id,
        emoji,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.Type().message(
            this.apiCall(this.token, 'sendDice', params)
        );
    }

    /**
     * Sends a chat action to the specified chat.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.chat_id - Unique identifier for the target chat or username of the target channel.
     * @param {string} [params.message_thread_id] - Identifier of the message thread the action should be sent in.
     * @param {string} params.action - Type of action to broadcast.
     * @returns {Object} - Returns the API call.
     */
    async sendChatAction(params = {
        chat_id,
        message_thread_id,
        action
    }) {
        return this.apiCall(this.token, 'sendChatAction', params);
    }

    /**
     * Retrieves a user's profile photos.
     * @param {Object} params - Parameters for the request.
     * @param {number} params.user_id - Unique identifier of the target user.
     * @param {number} [params.offset] - Sequential number of the first photo to be returned. By default, all photos are returned.
     * @param {number} [params.limit] - Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.
     * @returns {UserProfilePhotos} - The user's profile photos.
     */
    async getUserProfilePhotos(params = {
        user_id,
        offset,
        limit
    }) {
        return this.Type().UserProfilePhotos(
            this.apiCall(this.token, 'getUserProfilePhotos', params)
        );
    }

    /**
     * Retrieves information about a file and its download link.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.file_id - Unique identifier for the file.
     * @returns {Object} - A promise that resolves with the API call response.
     */
    async getFile(params = {
        file_id
    }) {
        return this.apiCall(this.token, 'getFile', params);
    }

    /**
     * Bans a user from a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {Number} params.user_id - Unique identifier of the target user.
     * @param {Number} [params.until_date] - Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever.
     * @param {Boolean} [params.revoke_messages] - Pass true, if the messages sent by the user in the chat should be deleted.
     * @returns {True}
     */
    async banChatMember(params = {
        chat_id,
        user_id,
        until_date,
        revoke_messages
    }) {
        return this.apiCall(this.token, 'banChatMember', params);
    }

    /**
     * Unban a user from a chat
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @param {Number} params.user_id - Unique identifier of the target user
     * @param {Boolean} [params.only_if_banned] - Optional. Pass true to unban only if the user is currently banned
     * @returns {True}
     */
    async unbanChatMember(params = {
        chat_id,
        user_id,
        only_if_banned
    }) {
        return this.apiCall(this.token, 'unbanChatMember', params);
    }

    /**
     * Restricts a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate admin rights.
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param {Number} params.user_id - Unique identifier of the target user
     * @param {Object} params.permissions - New user permissions
     * @param {Boolean} params.use_independent_chat_permissions - Pass True, if the user will not be able to change chat title, photo and other settings
     * @param {Number} params.until_date - Date when restrictions will be lifted for the user, unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever
     * @returns {True}
     */
    async restrictChatMember(params = {
        chat_id,
        user_id,
        permissions,
        use_independent_chat_permissions,
        until_date
    }) {
        return this.apiCall(this.token, 'restrictChatMember', params);
    }


    /**
     * Promote a user in a chat
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @param {Number} params.user_id - Unique identifier of the target user
     * @param {Boolean} [params.is_anonymous] - Pass True, if the user's presence in the chat is hidden
     * @param {Boolean} [params.can_manage_chat] - Pass True, if the user is allowed to manage the chat
     * @param {Boolean} [params.can_post_messages] - Pass True, if the user is allowed to send messages, contacts, locations and venues
     * @param {Boolean} [params.can_edit_messages] - Pass True, if the user is allowed to edit messages of other users and can pin messages
     * @param {Boolean} [params.can_delete_messages] - Pass True, if the user is allowed to delete messages of other users
     * @param {Boolean} [params.can_manage_video_chats] - Pass True, if the user is allowed to manage video chats
     * @param {Boolean} [params.can_restrict_members] - Pass True, if the user is allowed to restrict, ban or unban chat members
     * @param {Boolean} [params.can_promote_members] - Pass True, if the user is allowed to add new members to the chat
     * @param {Boolean} [params.can_change_info] - Pass True, if the user is allowed to change the chat title, photo and other settings
     * @param {Boolean} [params.can_invite_users] - Pass True, if the user is allowed to invite new users to the chat
     * @param {Boolean} [params.can_pin_messages] - Pass True, if the user is allowed to pin messages
     * @param {Boolean} [params.can_manage_topics] - Pass True, if the user is allowed to manage chat topics
     * @returns {True}
     */
    async promoteChatMember(params = {
        chat_id,
        user_id,
        is_anonymous,
        can_manage_chat,
        can_post_messages,
        can_edit_messages,
        can_delete_messages,
        can_manage_video_chats,
        can_restrict_members,
        can_promote_members,
        can_change_info,
        can_invite_users,
        can_pin_messages,
        can_manage_topics
    }) {
        return this.apiCall(this.token, 'promoteChatMember', params);
    }

    /**
     * Sets a custom title for an administrator in a chat.
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @param {Number} params.user_id - Unique identifier of the target user
     * @param {String} params.custom_title - New custom title for the administrator; 0-16 characters, emoji are not allowed
     * @returns {True}
     */
    async setChatAdministratorCustomTitle(params = {
        chat_id,
        user_id,
        custom_title
    }) {
        return this.apiCall(this.token, 'setChatAdministratorCustomTitle', params);
    }

    /**
     * Bans a user from a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {Number} params.sender_chat_id - Unique identifier of the user to be banned.
     * @returns {True}
     */
    async banChatSenderChat(params = {
        chat_id,
        sender_chat_id
    }) {
        return this.apiCall(this.token, 'banChatSenderChat', params);
    }

    /**
     * Unban a sender from a chat
     * @param {Object} params - Parameters for unbanning a sender from a chat
     * @param {Number} params.chat_id - The chat ID of the chat to unban the sender from
     * @param {Number} params.sender_chat_id - The chat ID of the sender to unban
     * @returns {True}
     */
    async unbanChatSenderChat(params = {
        chat_id,
        sender_chat_id
    }) {
        return this.apiCall(this.token, 'unbanChatSenderChat', params);
    }

    /**
     * Sets the permissions for a chat.
     * @param {Object} params - Parameters for setting chat permissions.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target supergroup or channel.
     * @param {Object} params.permissions - New default chat permissions.
     * @param {Boolean} params.use_independent_chat_permissions - Pass true to use independent chat permissions.
     * @returns {True}
     */
    async setChatPermissions(params = {
        chat_id,
        permissions,
        use_independent_chat_permissions
    }) {
        return this.apiCall(this.token, 'setChatPermissions', params);
    }

    /**
     * Generates a new invite link for a chat; any previously generated link is revoked.
     * The bot must be an administrator in the chat for this to work and must have the appropriate admin rights.
     * Returns the new invite link as String on success.
     * @param {Object} params - Parameters for the request
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @returns {String} - New invite link as String
     */
    async exportChatInviteLink(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'exportChatInviteLink', params);
    }

    /**
     * Creates a new invite link for a chat.
     * @param {Object} params - Parameters for creating a chat invite link.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {String} [params.name] - Name of the chat.
     * @param {Number} [params.expire_date] - Date when the link will expire in Unix time.
     * @param {Number} [params.member_limit] - Maximum number of members allowed in the chat.
     * @param {Boolean} [params.creates_join_request] - True, if the link will create a join request.
     * @returns {ChatInviteLink} - The newly created chat invite link.
     */
    async createChatInviteLink(params = {
        chat_id,
        name,
        expire_date,
        member_limit,
        creates_join_request
    }) {
        return this.Type().ChatInviteLink(
            this.apiCall(this.token, 'createChatInviteLink', params)
        );
    }

    /**
     * Edits the invite link of a chat.
     * @param {Object} params - Parameters for editing the invite link.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {String} params.invite_link - New invite link.
     * @param {String} [params.name] - Name of the chat.
     * @param {Number} [params.expire_date] - Expiration date of the invite link.
     * @param {Number} [params.member_limit] - Maximum number of members allowed in the chat.
     * @param {Boolean} [params.creates_join_request] - Whether the invite link should create a join request.
     * @returns {ChatInviteLink} - The new invite link.
     */
    async editChatInviteLink(params = {
        chat_id,
        invite_link,
        name,
        expire_date,
        member_limit,
        creates_join_request
    }) {
        return this.Type().ChatInviteLink(
            this.apiCall(this.token, 'editChatInviteLink', params)
        );
    }

    /**
     * Revoke an invite link for a chat
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @param {String} params.invite_link - Invite link to be revoked
     * @returns {ChatInviteLink} - Information about the revoked invite link
     */
    async revokeChatInviteLink(params = {
        chat_id,
        invite_link
    }) {
        return this.Type().ChatInviteLink(
            this.apiCall(this.token, 'revokeChatInviteLink', params)
        );
    }

    /**
     * Approves a chat join request from a user
     * @param {Object} params - Parameters for approving the chat join request
     * @param {Number} params.chat_id - The chat ID of the chat to approve the join request for
     * @param {Number} params.user_id - The user ID of the user to approve the join request for
     * @returns {True}
     */
    async approveChatJoinRequest(params = {
        chat_id,
        user_id
    }) {
        return this.apiCall(this.token, 'approveChatJoinRequest', params);
    }

    /**
     * Declines a chat join request from a user
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @param {Number} params.user_id - Unique identifier of the user to be declined
     * @returns {True}
     */
    async declineChatJoinRequest(params = {
        chat_id,
        user_id
    }) {
        return this.apiCall(this.token, 'declineChatJoinRequest', params);
    }

    /**
     * Sets the photo of a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Integer|String} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {InputFile} params.photo - New chat photo, uploaded using multipart/form-data.
     * @returns {True}
     */
    async setChatPhoto(params = {
        chat_id,
        photo
    }) {
        return this.apiCall(this.token, 'setChatPhoto', params);
    }

    /**
     * Deletes a chat photo.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @returns {True} 
     */
    async deleteChatPhoto(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'deleteChatPhoto', params);
    }

    /**
     * Sets the title of a chat.
     * @param {Object} params - Parameters for setting the chat title.
     * @param {string} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {string} params.title - New chat title, 1-255 characters.
     * @returns {True}
     */
    async setChatTitle(params = {
        chat_id,
        title
    }) {
        return this.apiCall(this.token, 'setChatTitle', params);
    }

    /**
     * Sets the description of a chat.
     * @param {Object} params - Parameters for setting the chat description.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {String} params.description - New chat description, 0-255 characters.
     * @returns {True}
     */
    async setChatDescription(params = {
        chat_id,
        description
    }) {
        return this.apiCall(this.token, 'setChatDescription', params);
    }

    /**
     * Pins a message in a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {Number} params.message_id - Identifier of a message to pin.
     * @param {Boolean} [params.disable_notification] - Pass true, if it is not necessary to send a notification to all chat members about the new pinned message.
     * @returns {True}
     */
    async pinChatMessage(params = {
        chat_id,
        message_id,
        disable_notification
    }) {
        return this.apiCall(this.token, 'pinChatMessage', params);
    }

    /**
     * Unpins a message in a chat.
     * @param {Object} params - Parameters for unpinning a message in a chat.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {Number} params.message_id - Identifier of a message to unpin.
     * @returns {True}
     */
    async unpinChatMessage(params = {
        chat_id,
        message_id
    }) {
        return this.apiCall(this.token, 'unpinChatMessage', params);
    }

    /**
     * Unpins all messages in a chat
     * @param {Object} params - Parameters for unpinning all messages in a chat
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @returns {True}
     */
    async unpinAllChatMessages(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'unpinAllChatMessages', params);
    }

    /**
     * Leaves a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.chat_id - Unique identifier for the target chat.
     * @returns {True}
     */
    async leaveChat(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'leaveChat', params);
    }

    /**
     * Retrieves information about a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.chat_id - Unique identifier for the target chat.
     * @returns {Chat} - Information about the chat.
     */
    async getChat(params = {
        chat_id
    }) {
        return this.Type().Chat(
            this.apiCall(this.token, 'getChat', params)
        );
    }

    /**
     * Retrieves a list of administrators in a chat.
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @returns {Type.ChatMember[]} - List of chat members that are administrators
     */
    async getChatAdministrators(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'getChatAdministrators', params).map(function (element) {
            return new Type().ChatMember(element)
        });
    }

    /**
     * Retrieves the number of members in a chat.
     * @param {Object} params - Parameters for the API call
     * @param {string} params.chat_id - Unique identifier for the target chat
     * @returns {Int} - number of members in the chat
     */
    async getChatMemberCount(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'getChatMemberCount', params);
    }

    /**
     * Retrieves information about a member of a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.chat_id - Unique identifier for the target chat.
     * @param {string} params.user_id - Unique identifier of the target user.
     * @returns {ChatMember} - Information about the chat member.
     */
    async getChatMember(params = {
        chat_id,
        user_id
    }) {
        return this.Type().ChatMember(
            this.apiCall(this.token, 'getChatMember', params)
        );
    }

    /**
     * Sets the sticker set for a chat.
     * @param {Object} params - Parameters for setting the sticker set.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel.
     * @param {String} params.sticker_set_name - Name of the sticker set to be set as the group sticker set.
     * @returns {True}
     */
    async setChatStickerSet(params = {
        chat_id,
        sticker_set_name
    }) {
        return this.apiCall(this.token, 'setChatStickerSet', params);
    }

    /**
     * Deletes the sticker set from a chat.
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel
     * @returns {True}
     */
    async deleteChatStickerSet(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'deleteChatStickerSet', params);
    }

    /**
     * Retrieves a list of stickers for a forum topic icon.
     * @returns {Sticker[]} An array of Sticker objects.
     */
    async getForumTopicIconStickers() {
        return this.apiCall(this.token, 'getForumTopicIconStickers', params).map(function (element) {
            return new Type().Sticker(element)
        });
    }

    /**
     * Creates a new forum topic in a chat.
     * @param {Object} params - Parameters for creating a new forum topic.
     * @param {Number} params.chat_id - The chat ID of the chat in which to create the forum topic.
     * @param {String} params.name - The name of the forum topic.
     * @param {String} params.icon_color - The color of the forum topic icon.
     * @param {Number} params.icon_custom_emoji_id - The ID of the custom emoji to use as the forum topic icon.
     * @returns {ForumTopic} The newly created forum topic.
     */
    async createForumTopic(params = {
        chat_id,
        name,
        icon_color,
        icon_custom_emoji_id
    }) {
        return this.Type().ForumTopic(
            this.apiCall(this.token, 'createForumTopic', params)
        );
    }

    /**
     * Edits a forum topic.
     * @param {Object} params - Parameters for editing the forum topic.
     * @param {Number} params.chat_id - The chat ID of the forum topic.
     * @param {Number} params.message_thread_id - The message thread ID of the forum topic.
     * @param {String} params.name - The new name of the forum topic.
     * @param {Number} params.icon_custom_emoji_id - The new custom emoji ID of the forum topic.
     * @returns {True}
     */
    async editForumTopic(params = {
        chat_id,
        message_thread_id,
        name,
        icon_custom_emoji_id
    }) {
        return this.apiCall(this.token, 'editForumTopic', params);
    }

    /**
     * Closes a forum topic in a chat
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - The chat ID of the forum topic
     * @param {Number} params.message_thread_id - The message thread ID of the forum topic
     * @returns {True}
     */
    async closeForumTopic(params = {
        chat_id,
        message_thread_id
    }) {
        return this.apiCall(this.token, 'closeForumTopic', params);
    }

    /**
     * Reopen a forum topic
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @param {Number} params.message_thread_id - Unique identifier for the forum topic
     * @returns {True}
     */
    async reopenForumTopic(params = {
        chat_id,
        message_thread_id
    }) {
        return this.apiCall(this.token, 'reopenForumTopic', params);
    }

    /**
     * Deletes a forum topic.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {Number} params.message_thread_id - Unique identifier for the message thread.
     * @returns {True}
     */
    async deleteForumTopic(params = {
        chat_id,
        message_thread_id
    }) {
        return this.apiCall(this.token, 'deleteForumTopic', params);
    }

    /**
     * Unpins all messages in a forum topic.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.chat_id - Unique identifier for the target chat.
     * @param {string} params.message_thread_id - Unique identifier for the forum topic.
     * @returns {True}
     */
    async unpinAllForumTopicMessages(params = {
        chat_id,
        message_thread_id
    }) {
        return this.apiCall(this.token, 'unpinAllForumTopicMessages', params);
    }

    /**
     * Edits the name of a general forum topic.
     * @param {Object} params - Parameters for editing the general forum topic.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {String} params.name - New name of the general forum topic.
     * @returns {True}
     */
    async editGeneralForumTopic(params = {
        chat_id,
        name
    }) {
        return this.apiCall(this.token, 'editGeneralForumTopic', params);
    }

    /**
     * Closes a general forum topic.
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @returns {True}
     */
    async closeGeneralForumTopic(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'closeGeneralForumTopic', params);
    }

    /**
     * Reopens a general forum topic.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel
     * @returns {True}
     */
    async reopenGeneralForumTopic(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'reopenGeneralForumTopic', params);
    }

    /**
     * Hides a general forum topic from the list of topics in the chat
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @returns {True}
     */
    async hideGeneralForumTopic(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'hideGeneralForumTopic', params);
    }

    /**
     * Unhide a general forum topic
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat
     * @returns {True}
     */
    async unhideGeneralForumTopic(params = {
        chat_id
    }) {
        return this.apiCall(this.token, 'unhideGeneralForumTopic', params);
    }

    /**
     * Sends an answer to a callback query sent from the client.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.callback_query_id - Unique identifier for the query to be answered.
     * @param {string} [params.text] - Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters.
     * @param {boolean} [params.show_alert] - If true, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to false.
     * @param {string} [params.url] - URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @Botfather, specify the URL that opens your game – note that this will only work if the query comes from a callback_game button.
     * @param {number} [params.cache_time] - The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0.
     * @returns {True}
     */
    async answerCallbackQuery(params = {
        callback_query_id,
        text,
        show_alert,
        url,
        cache_time
    }) {
        return this.apiCall(this.token, 'answerCallbackQuery', params);
    }

    /**
     * Sets the list of the bot's commands.
     * @param {Object} params - Parameters for setting the list of the bot's commands.
     * @param {Array} params.commands - A list of bot commands.
     * @param {BotCommandScope} [params.scope] - Bot commands scope.
     * @param {String} [params.language_code] - Bot commands language code.
     * @returns {True}
     */
    async setMyCommands(params = {
        commands,
        scope,
        language_code
    }) {
        if (!!params) {
            return this.apiCall(this.token, 'setMyCommands', params);
        } else {
            throw new Error('Empty setMyCommands params.')
        }
    }

    /**
     * Deletes all commands.
     * @param {Object} params - Parameters for the API call.
     * @param {BotCommandScope} params.scope - The scope of the commands to delete.
     * @param {String} params.language_code - The language code of the commands to delete.
     * @returns {True}
     */
    async deleteMyCommands(params = {
        scope,
        language_code
    }) {
        if (!!params) {
            return this.apiCall(this.token, 'deleteMyCommands', params);
        } else {
            throw new Error('Empty deleteMyCommands params.')
        }
    }

    /**
     * Retrieves a list of the current bot's commands.
     * @param {Object} params - Parameters for the request.
     * @param {BotCommandScope} params.scope - Bot scope.
     * @param {String} params.language_code - Bot language code.
     * @return {Array<BotCommand>} - List of commands supported by the bot.
     */
    async getMyCommands(params = {
        scope,
        language_code
    }) {
        return this.apiCall(this.token, 'getMyCommands', params).map(function (element) {
            return new Type().BotCommand(element)
        });
    }

    /**
     * Sets the bot's profile description.
     * @param {Object} params - Parameters for setting the user's profile description.
     * @param {string} params.description - The user's profile description.
     * @param {string} params.language_code - The language code of the user's profile description.
     * @returns {True}
     */
    async setMyDescription(params = {
        description,
        language_code
    }) {
        return this.apiCall(this.token, 'setMyDescription', params);
    }

    /**
     * Retrieve the description of the bot set by the bot owner.
     * @param {Object} [params] - Parameters for the API call.
     * @param {string} [params.language_code] - Language code for the description.
     * @return {BotDescription} - The description of the bot set by the bot owner.
     */
    async getMyDescription(params = {
        language_code
    }) {
        return this.Type().BotDescription(
            this.apiCall(this.token, 'getMyDescription', params)
        );
    }

    /**
     * Sets the bots's short description
     * @param {Object} params - Parameters for setting the user's short description
     * @param {string} params.short_description - The user's short description
     * @param {string} params.language_code - The language code of the user's short description
     * @returns {True}
     */
    async setMyShortDescription(params = {
        short_description,
        language_code
    }) {
        return this.apiCall(this.token, 'setMyShortDescription', params);
    }

    /**
     * Retrieve the short description of the bot.
     * @param {Object} [params] - Parameters for the request.
     * @param {string} [params.language_code] - Language code of the short description.
     * @returns {BotShortDescription} - Returns a short description of the bot.
     */
    async getMyShortDescription(params = {
        language_code
    }) {
        return this.Type().BotShortDescription(
            this.apiCall(this.token, 'getMyShortDescription', params)
        );
    }

    /**
     * Sets a custom menu button for a chat.
     * @param {Object} params - Parameters for setting a custom menu button.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {Object} params.menu_button - The menu button to be set.
     * @returns {True}
     */
    async setChatMenuButton(params = {
        chat_id,
        menu_button
    }) {
        return this.apiCall(this.token, 'setChatMenuButton', params);
    }

    /**
     * Retrieves the chat menu button for a given chat.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.chat_id - Unique identifier for the target chat.
     * @returns {MenuButton} - The chat menu button.
     */
    async getChatMenuButton(params = {
        chat_id
    }) {
        return this.Type().MenuButton(
            this.apiCall(this.token, 'getChatMenuButton', params)
        );
    }

    /**
     * Sets the default administrator rights for the bot.
     * @param {Object} params - Parameters for the method.
     * @param {ChatAdministratorRights} params.rights - Rights to set.
     * @param {boolean} params.for_channels - Pass true if the rights are for channels.
     * @returns {True}
     */
    async setMyDefaultAdministratorRights(params = {
        rights,
        for_channels
    }) {
        return this.apiCall(this.token, 'setMyDefaultAdministratorRights', params);
    }

    /**
     * Retrieves the default administrator rights for the bot in the specified channels.
     * @param {Object} [params] - Parameters for the API call
     * @param {boolean} [params.for_channels] - Pass true to return the rights for channels only
     * @returns {ChatAdministratorRights} - Default administrator rights for the bot
     */
    async getMyDefaultAdministratorRights(params = {
        for_channels
    }) {
        return this.Type().ChatAdministratorRights(
            this.apiCall(this.token, 'getMyDefaultAdministratorRights', params)
        );
    }

    // Updating messages

    /**
     * Edits the text of a message sent by the bot or of an inline message sent via the bot (for inline bots).
     * @param {Object} params - Parameters for editing the message.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel.
     * @param {Number} params.message_id - Identifier of the sent message.
     * @param {String} params.inline_message_id - Identifier of the inline message.
     * @param {String} params.text - New text of the message.
     * @param {String} [params.parse_mode] - Mode for parsing entities in the message text.
     * @param {Object[]} [params.entities] - List of special entities that appear in message text, which can be specified instead of parse_mode.
     * @param {Boolean} [params.disable_web_page_preview] - Disables link previews for links in this message.
     * @param {Object} [params.reply_markup] - Additional interface options.
     * @returns {Message|True} - On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     */
    async editMessageText(params = {
        chat_id,
        message_id,
        inline_message_id,
        text,
        parse_mode,
        entities,
        disable_web_page_preview,
        reply_markup
    }) {
        return this.apiCall(this.token, 'editMessageText', params);
    }

    /**
     * Edits the caption of a message sent by the bot.
     * @param {Object} params - Parameters for editing the message caption.
     * @param {Number|String} params.chat_id - Unique identifier for the target chat or username of the target channel.
     * @param {Number} params.message_id - Identifier of the sent message.
     * @param {String} params.inline_message_id - Identifier of the inline message.
     * @param {String} params.caption - New caption of the message.
     * @param {String} [params.parse_mode] - Mode for parsing entities in the message caption.
     * @param {Object[]} [params.caption_entities] - List of special entities that appear in the caption, which can be specified instead of parse_mode.
     * @param {Object} [params.reply_markup] - Additional interface options.
     * @returns {Message|True} - On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     */
    async editMessageCaption(params = {
        chat_id,
        message_id,
        inline_message_id,
        caption,
        parse_mode,
        caption_entities,
        reply_markup
    }) {
        return this.apiCall(this.token, 'editMessageCaption', params);
    }

    /**
     * Edits the media of a message sent by the bot.
     * @param {Object} params - Parameters for editing the message media.
     * @param {Number|String} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {Number} params.message_id - Identifier of the sent message.
     * @param {String} params.inline_message_id - Identifier of the inline message.
     * @param {Object} params.media - A JSON-serialized object for a new media content of the message.
     * @param {Object} params.reply_markup - A JSON-serialized object for a new inline keyboard.
     * @returns {Message|True} - On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     */
    async editMessageMedia(params = {
        chat_id,
        message_id,
        inline_message_id,
        media,
        reply_markup
    }) {
        return this.apiCall(this.token, 'editMessageMedia', params);
    }

    /**
     * Edit a live location message sent via the bot.
     * @param {Object} params - Parameters for editing the live location message.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {Number} params.message_id - Identifier of the sent message.
     * @param {String} params.inline_message_id - Identifier of the inline message.
     * @param {Number} params.latitude - Latitude of new location.
     * @param {Number} params.longitude - Longitude of new location.
     * @param {Number} [params.horizontal_accuracy] - The radius of uncertainty for the location, measured in meters; 0-1500.
     * @param {Number} [params.heading] - Direction in which the user is moving, in degrees; 1-360.
     * @param {Number} [params.proximity_alert_radius] - Maximum distance for proximity alerts about approaching another chat member, in meters; 0-100000.
     * @param {Object} [params.reply_markup] - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     * @returns {Message|True} - On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     */
    async editMessageLiveLocation(params = {
        chat_id,
        message_id,
        inline_message_id,
        latitude,
        longitude,
        horizontal_accuracy,
        heading,
        proximity_alert_radius,
        reply_markup
    }) {
        return this.apiCall(this.token, 'editMessageLiveLocation', params);
    }

    /**
     * Stops updating a live location message sent via the bot.
     * @param {Object} params - Parameters for the API call
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel
     * @param {Number} params.message_id - Identifier of the sent message
     * @param {String} [params.inline_message_id] - Identifier of the inline message
     * @param {Object} [params.reply_markup] - A JSON-serialized object for an inline keyboard
     * @returns {Message|True} - On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     */
    async stopMessageLiveLocation(params = {
        chat_id,
        message_id,
        inline_message_id,
        reply_markup
    }) {
        return this.apiCall(this.token, 'stopMessageLiveLocation', params);
    }

    /**
     * Edits the reply markup of a message sent by the bot.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {Number} params.message_id - Identifier of the sent message.
     * @param {Number} params.inline_message_id - Identifier of the inline message.
     * @param {Object} params.reply_markup - A JSON-serialized object for an inline keyboard.
     * @returns {Message|True} - On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned.
     */
    async editMessageReplyMarkup(params = {
        chat_id,
        message_id,
        inline_message_id,
        reply_markup
    }) {
        return this.apiCall(this.token, 'editMessageReplyMarkup', params);
    }

    /**
     * Stops a poll in a Telegram chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat.
     * @param {Number} params.message_id - Identifier of the original message with the poll.
     * @param {Object} params.reply_markup - Additional interface options.
     * @returns {Poll} - The stopped poll.
     */
    async stopPoll(params = {
        chat_id,
        message_id,
        reply_markup
    }) {
        return new Type().Poll(
            this.apiCall(this.token, 'stopPoll', params)
        );
    }


    /**
     * Deletes a message from a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {string} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {string} params.message_id - Unique identifier of the target message.
     * @returns {True}
     */
    async deleteMessage(params = {
        chat_id,
        message_id
    }) {
        return this.apiCall(this.token, 'deleteMessage', params);
    }

    // Stickers

    /**
     * Sends a sticker to a chat.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.chat_id - Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     * @param {Number} [params.message_thread_id] - Identifier of the message thread the sticker belongs to.
     * @param {String} params.sticker - Sticker to send.
     * @param {String} [params.emoji] - Emoji associated with the sticker.
     * @param {Boolean} [params.disable_notification] - Sends the message silently. Users will receive a notification with no sound.
     * @param {Boolean} [params.protect_content] - Pass True, if the uploaded sticker is protected.
     * @param {Number} [params.reply_to_message_id] - If the message is a reply, ID of the original message.
     * @param {Boolean} [params.allow_sending_without_reply] - Pass True, if the message should be sent even if the specified replied-to message is not found.
     * @param {Object} [params.reply_markup] - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     * @returns {Message} - On success, the sent Message is returned.
     */
    async sendSticker(params = {
        chat_id,
        message_thread_id,
        sticker,
        emoji,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return new Type().Message(
            this.apiCall(this.token, 'sendSticker', params)
        );
    }

    /**
     * Retrieves a sticker set
     * @param {Object} params - Parameters for the API call
     * @param {string} params.name - Name of the sticker set
     * @returns {StickerSet} StickerSet object
     */
    async getStickerSet(params = {
        name
    }) {
        return new Type().StickerSet(
            this.apiCall(this.token, 'getStickerSet', params)
        );
    }

    /**
     * Retrieve custom emoji stickers
     * @param {Object} [params] - Parameters for the API call
     * @param {Array<String>} [params.custom_emoji_ids] - Array of custom emoji ids
     * @returns {Array<Sticker>} - Array of custom emoji stickers
     */
    async getCustomEmojiStickers(params = {
        custom_emoji_ids
    }) {
        return this.apiCall(this.token, 'getCustomEmojiStickers', params).map(function (element) {
            return new Type().Sticker(element)
        });
    }

    /**
     * Uploads a sticker file to the Telegram servers.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.user_id - Unique identifier of the target user.
     * @param {File} params.sticker - The sticker to upload.
     * @param {String} params.sticker_format - The format of the sticker.
     * @returns {File} The uploaded sticker file.
     */
    async uploadStickerFile(params = {
        user_id,
        sticker,
        sticker_format
    }) {
        return new Type().File(
            this.apiCall(this.token, 'uploadStickerFile', params)
        );
    }

    /**
     * Creates a new sticker set for a user
     * @param {Object} params - Parameters for creating a new sticker set
     * @param {Number} params.user_id - Unique identifier of the target user
     * @param {String} params.name - Short name of the sticker set, to be used in t.me/addstickers/ URLs (e.g., animals)
     * @param {String} params.title - Sticker set title, 1-64 characters
     * @param {Array} params.stickers - List of stickers to be added to the set
     * @param {String} params.sticker_format - File type of the stickers, either "png" or "tgs"
     * @param {String} params.sticker_type - Type of the sticker set, either "image" or "animated"
     * @param {Boolean} params.needs_repainting - Pass True, if a set of mask stickers should be created
     * @returns {True}
     */
    async createNewStickerSet(params = {
        user_id,
        name,
        title,
        stickers,
        sticker_format,
        sticker_type,
        needs_repainting
    }) {
        return this.apiCall(this.token, 'createNewStickerSet', params);
    }

    /**
     * Adds a new sticker to a set created by the bot.
     * @param {Object} params - Parameters for the API call.
     * @param {Number} params.user_id - User identifier of sticker set owner.
     * @param {String} params.name - Sticker set name.
     * @param {InputSticker} params.sticker - Sticker object.
     * @returns {True}
     */
    async addStickerToSet(params = {
        user_id,
        name,
        sticker
    }) {
        return this.apiCall(this.token, 'addStickerToSet', params);
    }

    /**
     * Sets the position of a sticker in a set created by the bot.
     * @param {Object} params - Parameters for the API call.
     * @param {String} params.sticker - File identifier of the sticker.
     * @param {Number} params.position - New sticker position in the set, zero-based.
     * @returns {True}
     */
    async setStickerPositionInSet(params = {
        sticker,
        position
    }) {
        return this.apiCall(this.token, 'setStickerPositionInSet', params);
    }

    /**
     * Deletes a sticker from a set created by the bot.
     * @param {Object} params - Parameters for the API call
     * @param {String} params.sticker - File identifier of the sticker
     * @returns {True}
     */
    async deleteStickerFromSet(params = {
        sticker
    }) {
        return this.apiCall(this.token, 'deleteStickerFromSet', params);
    }

    /**
     * Sets the list of emojis that can be used in the sticker set.
     * @param {Object} params - Parameters for the API call.
     * @param {String} params.sticker - File identifier of the sticker set.
     * @param {Array} params.emoji_list - List of emojis that can be used in the sticker set.
     * @returns {True}
     */
    async setStickerEmojiList(params = {
        sticker,
        emoji_list
    }) {
        return this.apiCall(this.token, 'setStickerEmojiList', params);
    }

    /**
     * Sets the list of keywords for a sticker.
     * @param {Object} params - Parameters for setting the list of keywords for a sticker.
     * @param {String} params.sticker - File identifier of the sticker.
     * @param {String[]} params.keywords - List of keywords for the sticker.
     * @returns {True}
     */
    async setStickerKeywords(params = {
        sticker,
        keywords
    }) {
        return this.apiCall(this.token, 'setStickerKeywords', params);
    }

    /**
     * Sets the position of a mask for a sticker in a sticker set.
     * @param {Object} params - Parameters for the API call.
     * @param {String} params.sticker - File identifier of the sticker.
     * @param {Object} params.mask_position - New position of the mask for the sticker.
     * @returns {True}
     */
    async setStickerMaskPosition(params = {
        sticker,
        mask_position
    }) {
        return this.apiCall(this.token, 'setStickerMaskPosition', params);
    }

    /**
     * Sets the title of a sticker set.
     * @param {Object} params - Parameters for API call.
     * @param {string} params.name - The name of the sticker set.
     * @param {string} params.title - The new title of the sticker set.
     * @returns {True}
     */
    async setStickerSetTitle(params = {
        name,
        title
    }) {
        return this.apiCall(this.token, 'setStickerSetTitle', params);
    }

    /**
      * Sets the thumbnail of the sticker set
      * @param {Object} params - Sets the thumbnail of the sticker set
      * @param {string} params.name - Name of the sticker set
      * @param {string} params.user_id - Unique identifier of the sticker set owner
      * @param {string} params.thumbnail - Thumbnail for the sticker set, must be up to 128 kilobytes in size and have width and height exactly 100px, and either a PNG or TGS format
     * @returns {True}
     */
    async setStickerSetThumbnail(params = {
        name,
        user_id,
        thumbnail
    }) {
        return this.apiCall(this.token, 'setStickerSetThumbnail', params);
    }

    /**
     * Set the thumbnail for a previously created custom emoji sticker set.
     * @param {Object} params - Parameters
     * @param {String} params.name - Name of the custom emoji sticker set
     * @param {String} params.custom_emoji_id - Custom Emoji ID to be set as the thumbnail
     * @returns {True}
     */
    async setCustomEmojiStickerSetThumbnail(params = {
        name,
        custom_emoji_id
    }) {
        return this.apiCall(this.token, 'setCustomEmojiStickerSetThumbnail', params);
    }

    /**
     * Makes an API call to delete a sticker set
     * @param {Object} [params] The parameters for the API request 
     * @param {string} params.name The name of the sticker set to delete
     * @returns {True}
     */
    async deleteStickerSet(params = {
        name
    }) {
        return this.apiCall(this.token, 'deleteStickerSet', params);
    }

    // Inline mode

    /**
     * Sends results for an inline query to a user.
     * @param {Object} params - The parameters for this request
     * @param {String} params.inline_query_id - Unique identifier for the answered query
     * @param {Array<Object>} params.results - A list of results for the inline query
     * @param {Number} params.cache_time - The maximum amount of time in seconds that the result of the inline query may be cached for
     * @param {Boolean} params.is_personal - Pass `true`, if results may be based on the user's prior query
     * @param {String} params.next_offset - Pass the offset that a client should send in the next query with the same text to receive more results
     * @param {String} params.switch_pm_text - If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter `switch_pm_parameter`
     * @param {String} params.switch_pm_parameter - Deep-linking parameter for the /start message sent to the bot when user presses the switch button
     * @return {Object}
     */
    async answerInlineQuery(params = {
        inline_query_id,
        results,
        cache_time,
        is_personal,
        next_offset,
        switch_pm_text,
        switch_pm_parameter
    }) {
        return this.apiCall(this.token, 'answerInlineQuery', params);
    }

    /**
     * An API method for Telegram, used to quickly respond to a web application's query.
     * @param {Object} params - Parameters for answering a web application's query.
     * @param {string} params.web_app_query_id - Unique identifier of the query. 
     * @param {string} params.result - JSON-serialized result of the query.
     * @returns {Object} API response.
     */
    async answerWebAppQuery(params = {
        web_app_query_id,
        result
    }) {
        return this.apiCall(this.token, 'answerWebAppQuery', params);
    }

    // Payments

    /**
     * Send an invoice.
     * @param {Object} [params] Parameters for the API method.
     * @param {Number|String} [params.chat_id] Unique identifier for the target chat or username of the target channel (in the format `@channelusername`).
     * @param {Number} [params.message_thread_id] An identifier for the message thread the invoice belongs to.
     * @param {String} [params.title] Product name.
     * @param {String} [params.description] Product description.
     * @param {String} [params.payload] Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
     * @param {String} [params.provider_token] Payments provider token, obtained via [Botfather](https://t.me/botfather).
     * @param {String} [params.currency] Three-letter ISO 4217 currency code.
     * @param {Object[]} [params.prices] Price breakdown, a list of objects describing each component of the final price.
     * @param {Object[]} [params.max_tip_amount] A list of possible payment amounts provided by the bot, for practitioners of the [tip button](https://telegram.org/blog/payments#surprising-others-with-tips).
     * @param {Object[]} [params.suggested_tip_amounts] A list of possible payment amounts provided by the bot, for practitioners of the [tip button](https://telegram.org/blog/payments#surprising-others-with-tips).
     * @param {String} [params.start_parameter] Token defining the current invoice, used to reconstruct the invoice later in the customer's dashboard.
     * @param {String} [params.provider_data] JSON-encoded data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.
     * @param {String} [params.photo_url] URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.
     * @param {Integer} [params.photo_size] Photo size.
     * @param {Integer} [params.photo_width] Photo width.
     * @param {Integer} [params.photo_height] Photo height.
     * @param {Boolean} [params.need_name] Pass `true` if you require the user's full name to complete the order.
     * @param {Boolean} [params.need_phone_number] Pass `true` if you require the user's phone number to complete the order.
     * @param {Boolean} [params.need_email] Pass `true` if you require the user's email address to complete the order.
     * @param {Boolean} [params.need_shipping_address] Pass `true` if you require the user's shipping address to complete the order.
     * @param {Boolean} [params.send_phone_number_to_provider] Pass `true` if user's phone number should be sent to the provider.
     * @param {Boolean} [params.send_email_to_provider] Pass `true` if user's email address should be sent to the provider.
     * @param {Boolean} [params.is_flexible] Pass `true` if the final price depends on the shipping method.
     * @param {Boolean} [params.disable_notification] Sends the message silently. Users will receive a notification with no sound.
     * @param {Boolean} [params.protect_content] Sets [content protection](https://core.telegram.org/bots/api#copyright-warning).
     * @param {Number} [params.reply_to_message_id] If `reply_to_message_id` is not 0, content of the message with the specified ID will be used instead of the caption.
     * @param {Boolean} [params.allow_sending_without_reply] Pass `true`, if the message should be sent even if the specified replied-to message is not found.
     * @param {Object} [params.reply_markup] A [custom keyboard](https://core.telegram.org/bots#keyboards) can be [attached](https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating) to the message.
     * @return {Object} message object.
     */
    async sendInvoice(params = {
        chat_id,
        message_thread_id,
        title,
        description,
        payload,
        provider_token,
        currency,
        prices,
        max_tip_amount,
        suggested_tip_amounts,
        start_parameter,
        provider_data,
        photo_url,
        photo_size,
        photo_width,
        photo_height,
        need_name,
        need_phone_number,
        need_email,
        need_shipping_address,
        send_phone_number_to_provider,
        send_email_to_provider,
        is_flexible,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.apiCall(this.token, 'sendInvoice', params);
    }

    /**
     * Create an invoice.
     * @param {Object} params All of the params for creating an invoice link.
     * @param {string} params.title The title of the invoice that is displayed in the Provider app.
     * @param {string} params.description The description of the invoice that is displayed in the Provider app.
     * @param {string} params.provider_token Token that specifies which Provider should be used for creating the invoice.
     * @param {string} params.currency Currency of the invoice.
     * @param {Array} params.prices The prices of the invoice.
     * @param {int} params.max_tip_amount The maximum amount the user can choose when paying.
     * @param {Array} params.suggested_tip_amounts Suggested amounts the user can choose when paying.
     * @param {Object} params.provider_data Additional Data to send to the provider.
     * @param {string} params.photo_url URL of the photo for the invoice.
     * @param {int} params.photo_size Size of the photo for the invoice.
     * @param {int} params.photo_width Width of the photo for the invoice.
     * @param {int} params.photo_height Height of the photo for the invoice.
     * @param {boolean} params.need_name Should ask the user for their name when paying.
     * @param {boolean} params.need_phone_number Should ask the user for their phone number when paying.
     * @param {boolean} params.need_email Should ask the user for their email address when paying.
     * @param {boolean} params.need_shipping_address Should ask the user for their shipping address when paying.
     * @param {boolean} params.send_phone_number_to_provider Should send the user's phone number to the provider.
     * @param {boolean} params.send_email_to_provider Should send the user's email to the provider.
     * @param {boolean} params.is_flexible Set if the total price depends on the shipping address.
     * @returns {Object} The created invoice link.
     */
    async createInvoiceLink(params = {
        title,
        description,
        payload,
        provider_token,
        currency,
        prices,
        max_tip_amount,
        suggested_tip_amounts,
        provider_data,
        photo_url,
        photo_size,
        photo_width,
        photo_height,
        need_name,
        need_phone_number,
        need_email,
        need_shipping_address,
        send_phone_number_to_provider,
        send_email_to_provider,
        is_flexible
    }) {
        return this.apiCall(this.token, 'createInvoiceLink', params);
    }

    /**
     * Answers a shipping query.
     *
     * @param {Object} params - Parameters of the shipping query.
     * @param {String} params.shipping_query_id - Unique identifier for the query to be answered
     * @param {Boolean} params.ok - Specify true if delivery to the specified address is possible
     * @param {Array} params.shipping_options - Required if ok is true. A JSON-serialized array of available shipping options
     * @param {String} params.error_message - Required if ok is false. Error message in human readable form that explains why it is impossible to complete the order
     *
     * @return {Object} The api result
     */
    async answerShippingQuery(params = {
        shipping_query_id,
        ok,
        shipping_options,
        error_message
    }) {
        return this.apiCall(this.token, 'answerShippingQuery', params);
    }

    /**
     * This method is used to send a response from bot to pre-checkout query from user.
     * 
     * @param {Object} params
     * @param {String} params.pre_checkout_query_id - Pre-Checkout Query ID
     * @param {Boolean} params.ok - Specify if everything is alright (true) or something went wrong (false).
     * @param {String} [params.error_message] - Error message in human readable into (present if ok is false)
     * @returns {Object}
     */
    async answerPreCheckoutQuery(params = {
        pre_checkout_query_id,
        ok,
        error_message
    }) {
        return this.apiCall(this.token, 'answerPreCheckoutQuery', params);
    }

    // Telegram Passport

    /**
     * Sets passport data errors.
     * @param {Object} params - The parameters for the API call. 
     * @param {Number} params.user_id - Telegram user id.
     * @param {Object[]} params.errors - List of errors for data set in Telegram Passport 
     * @returns {Object[]} Returns an array of objects representing errors for data set in Telegram Passport.
     */
    async setPassportDataErrors(params = {
        user_id,
        errors
    }) {
        return this.apiCall(this.token, 'setPassportDataErrors', params).map(function (element) {
            return this.Type().PassportElementError(element)
        });
    }

    // Games

    /**
     * @name sendGame
     * @param {Object} params
     * @param {String|Number} params.chat_id Unique identifier for the target chat or username of the target supergroup or channel
     * @param {String|Number} [params.message_thread_id] Identifier of the sent message if known
     * @param {String} params.game_short_name Short name of the game, serves as the unique identifier for the game
     * @param {Boolean} [params.disable_notification=false] Sends the message silently. Users will receive a notification with no sound
     * @param {Boolean} [params.protect_content=false] Pass True, if the game sent should be automatically launched for the user
     * @param {Number} [params.reply_to_message_id] If the message is a reply, ID of the original message
     * @param {Boolean} [params.allow_sending_without_reply=false] Pass True, if the message should be sent even if the specified replied-to message is not found
     * @param {Object} [params.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user
     * @returns {Object}
     */
    async sendGame(params = {
        chat_id,
        message_thread_id,
        game_short_name,
        disable_notification,
        protect_content,
        reply_to_message_id,
        allow_sending_without_reply,
        reply_markup
    }) {
        return this.apiCall(this.token, 'sendGame', params);
    }

    /**
     * Sets the score of the specified user in a game. 
     * On success, True is returned.
     * @param {Object} params 
     * @param {String} params.user_id Unique identifier of the target user
     * @param {Number} params.score New score
     * @param {Boolean} [params.force] Optional. Pass True, if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters 
     * @param {Boolean} [params.disable_edit_message] Pass True, if the game message should not be automatically edited 
     * @param {Number} params.chat_id Optional. Required if inline_message_id is not specified
     * @param {Number} params.message_id Optional. Required if inline_message_id is not specified
     * @param {String} params.inline_message_id Optional. Required if chat_id and message_id are not specified
     * @returns {Boolean}
     */
    async setGameScore(params = {
        user_id,
        score,
        force,
        disable_edit_message,
        chat_id,
        message_id,
        inline_message_id
    }) {
        return this.apiCall(this.token, 'setGameScore', params);
    }

    /**
     * Gets data for high score tables. 
     * Will return the score of the specified user and several of their neighbors in a game.
     * @param {Object} params An object containing user, chat, message, and inline message id parameters.
     * @param {Number} params.user_id Unique identifier of the target user
     * @param {Number} params.chat_id Unique identifier of the target chat 
     * @param {Number} params.message_id Identifier of the sent message
     * @param {Number} params.inline_message_id Identifier of the inline message
     * @returns {Object} The data for high score tables
     */
    async getGameHighScores(params = {
        user_id,
        chat_id,
        message_id,
        inline_message_id
    }) {
        return this.apiCall(this.token, 'getGameHighScores', params);
    }
}

class Type {
    constructor() { }

    // Getting updates

    /**
     * @method Update
     * @param {Number} update_id - The update ID
     * @param {Object} [message] - The message object. Must contain at least one of the following fields: message_id, date, chat, text, ...
     * @param {Object} [edited_message] - The edited message object. Must contain at least one of the following fields: message_id, date, chat, text, ...
     * @param {Object} [channel_post] - The channel post object. Must contain at least one of the following fields: message_id, date, chat, text, ...
     * @param {Object} [edited_channel_post] - The edited channel post object. Must contain at least one of the following fields: message_id, date, chat, text, ...
     * @param {Object} [inline_query] - The inline query object. Must contain at least one of the following fields: id, from, query, ...
     * @param {Object} [chosen_inline_result] - The chosen inline result object. Must contain at least one of the following fields: result_id, from, query, ...
     * @param {Object} [callback_query] - The callback query object. Must contain at least one of the following fields: id, from, data, ...
     * @param {Object} [shipping_query] - The shipping query object. Must contain at least one of the following fields: id, from, invoice_payload, ...
     * @param {Object} [pre_checkout_query] - The pre checkout query object. Must contain at least one of the following fields: id, from, currency, ...
     * @param {Object} [poll] - The poll object. Must contain at least one of the following fields: id, question, options, ...
     * @param {Object} [poll_answer] - The poll answer object. Must contain at least one of the following fields: poll_id, user, option_ids, ...
     * @param {Object} [my_chat_member] - The my chat member object. Must contain at least one of the following fields: chat, from, new_chat_member, ...
     * @param {Object} [chat_member] - The chat member object. Must contain at least one of the following fields: chat, from, new_chat_member, ...
     * @param {Object} [chat_join_request] - The chat join request object. Must contain at least one of the following fields: id, from, chat, ...
     * @returns {Update} A new Update object
     */
    update(params = { update_id, message, edited_message, channel_post, edited_channel_post, inline_query, chosen_inline_result, callback_query, shipping_query, pre_checkout_query, poll, poll_answer, my_chat_member, chat_member, chat_join_request }) {
        class Update {
            constructor({ update_id, message, edited_message, channel_post, edited_channel_post, inline_query, chosen_inline_result, callback_query, shipping_query, pre_checkout_query, poll, poll_answer, my_chat_member, chat_member, chat_join_request }) {
                this.update_id = update_id;
                this.message = message ? new Type().message(message) : null;
                this.edited_message = edited_message ? new Type().message(edited_message) : null;
                this.channel_post = channel_post ? new Type().message(channel_post) : null;
                this.edited_channel_post = edited_channel_post ? new Type().message(edited_channel_post) : null;
                this.inline_query = inline_query ? new Type().InlineQuery(inline_query) : null;
                this.chosen_inline_result = chosen_inline_result ? new Type().ChosenInlineResult(chosen_inline_result) : null;
                this.callback_query = callback_query ? new Type().callbackQuery(callback_query) : null;
                this.shipping_query = shipping_query ? new Type().ShippingQuery(shipping_query) : null;
                this.pre_checkout_query = pre_checkout_query ? new Type().PreCheckoutQuery(pre_checkout_query) : null;
                this.poll = poll ? new Type().Poll(poll) : null;
                this.poll_answer = poll_answer ? new Type().PollAnswer(poll_answer) : null;
                this.my_chat_member = my_chat_member ? new Type().ChatMemberUpdated(my_chat_member) : null;
                this.chat_member = chat_member ? new Type().ChatMemberUpdated(chat_member) : null;
                this.chat_join_request = chat_join_request ? new Type().ChatJoinRequest(chat_join_request) : null;
            }
        }
        return new Update(params);
    }

    /**
     * @method WebhookInfo
     * @param {String} url - The URL of the webhook
     * @param {Boolean} has_custom_certificate - Whether the webhook has a custom certificate
     * @param {Number} pending_update_count - The number of pending updates
     * @param {String} ip_address - The IP address of the webhook
     * @param {Date} last_error_date - The date of the last error
     * @param {String} last_error_message - The message of the last error
     * @param {Date} last_synchronization_error_date - The date of the last synchronization error
     * @param {Number} max_connections - The maximum number of connections
     * @param {Array} allowed_updates - An array of allowed updates
     * @returns {WebhookInfo} A new WebhookInfo object
     */
    webhookInfo(params = { url, has_custom_certificate, pending_update_count, ip_address, last_error_date, last_error_message, last_synchronization_error_date, max_connections, allowed_updates }) {
        class WebhookInfo {
            constructor({ url, has_custom_certificate, pending_update_count, ip_address, last_error_date, last_error_message, last_synchronization_error_date, max_connections, allowed_updates }) {
                this.url = url;
                this.has_custom_certificate = has_custom_certificate;
                this.pending_update_count = pending_update_count;
                this.ip_address = ip_address;
                this.last_error_date = last_error_date;
                this.last_error_message = last_error_message;
                this.last_synchronization_error_date = last_synchronization_error_date;
                this.max_connections = max_connections;
                this.allowed_updates = allowed_updates;
            }
        }
        return new WebhookInfo(params);
    }

    // Available types

    /**
     * @method User
     * @param {Number} id - The user's ID
     * @param {Boolean} is_bot - Whether the user is a bot
     * @param {String} first_name - The user's first name
     * @param {String} last_name - The user's last name
     * @param {String} username - The user's username
     * @param {String} language_code - The user's language code
     * @param {Boolean} is_premium - Whether the user is a premium user
     * @param {Boolean} added_to_attachment_menu - Whether the user has been added to the attachment menu
     * @param {Boolean} can_join_groups - Whether the user can join groups
     * @param {Boolean} can_read_all_group_messages - Whether the user can read all group messages
     * @param {Boolean} supports_inline_queries - Whether the user supports inline queries
     * @returns {User} A new User object
     */
    user(params = { id, is_bot, first_name, last_name, username, language_code, is_premium, added_to_attachment_menu, can_join_groups, can_read_all_group_messages, supports_inline_queries }) {
        class User_tg {
            constructor({ id, is_bot, first_name, last_name, username, language_code, is_premium, added_to_attachment_menu, can_join_groups, can_read_all_group_messages, supports_inline_queries }) {
                this.id = id;
                this.is_bot = is_bot;
                this.first_name = first_name;
                this.last_name = last_name;
                this.username = username;
                this.language_code = language_code;
                this.is_premium = is_premium;
                this.added_to_attachment_menu = added_to_attachment_menu;
                this.can_join_groups = can_join_groups;
                this.can_read_all_group_messages = can_read_all_group_messages;
                this.supports_inline_queries = supports_inline_queries;
            }
        }
        return new User_tg(params);
    }

    /**
     * @method Chat
     * @param {Number} id - The chat's unique identifier.
     * @param {String} type - The type of chat.
     * @param {String} title - The chat's title.
     * @param {String} username - The chat's username.
     * @param {String} first_name - The chat's first name.
     * @param {String} last_name - The chat's last name.
     * @param {Boolean} is_forum - Whether the chat is a forum.
     * @param {Object} photo - The chat's photo.
     * @param {Array} active_usernames - The chat's active usernames.
     * @param {String} emoji_status_custom_emoji_id - The chat's emoji status custom emoji id.
     * @param {String} bio - The chat's bio.
     * @param {Boolean} has_private_forwards - Whether the chat has private forwards.
     * @param {Boolean} has_restricted_voice_and_video_messages - Whether the chat has restricted voice and video messages.
     * @param {Boolean} join_to_send_messages - Whether the chat requires users to join in order to send messages.
     * @param {Boolean} join_by_request - Whether the chat requires users to join by request.
     * @param {String} description - The chat's description.
     * @param {String} invite_link - The chat's invite link.
     * @param {Object} pinned_message - The chat's pinned message.
     * @param {Object} permissions - The chat's permissions.
     * @param {Number} slow_mode_delay - The chat's slow mode delay.
     * @param {Number} message_auto_delete_time - The chat's message auto delete time.
     * @param {Boolean} has_aggressive_anti_spam_enabled - Whether the chat has aggressive anti-spam enabled.
     * @param {Boolean} has_hidden_members - Whether the chat has hidden members.
     * @param {Boolean} has_protected_content - Whether the chat has protected content.
     * @param {String} sticker_set_name - The chat's sticker set name.
     * @param {Boolean} can_set_sticker_set - Whether the chat can set a sticker set.
     * @param {Number} linked_chat_id - The chat's linked chat id.
     * @param {Object} location - The chat's location.
     * @returns {Object} A new chat object.
     */
    chat(params = { id, type, title, username, first_name, last_name, is_forum, photo, active_usernames, emoji_status_custom_emoji_id, bio, has_private_forwards, has_restricted_voice_and_video_messages, join_to_send_messages, join_by_request, description, invite_link, pinned_message, permissions, slow_mode_delay, message_auto_delete_time, has_aggressive_anti_spam_enabled, has_hidden_members, has_protected_content, sticker_set_name, can_set_sticker_set, linked_chat_id, location }) {
        class Chat {
            constructor({ id, type, title, username, first_name, last_name, is_forum, photo, active_usernames, emoji_status_custom_emoji_id, bio, has_private_forwards, has_restricted_voice_and_video_messages, join_to_send_messages, join_by_request, description, invite_link, pinned_message, permissions, slow_mode_delay, message_auto_delete_time, has_aggressive_anti_spam_enabled, has_hidden_members, has_protected_content, sticker_set_name, can_set_sticker_set, linked_chat_id, location }) {
                this.id = id;
                this.type = type;
                this.title = title;
                this.username = username;
                this.first_name = first_name;
                this.last_name = last_name;
                this.is_forum = is_forum;
                this.photo = photo ? new Type().ChatPhoto(photo) : null;
                this.active_usernames = active_usernames;
                this.emoji_status_custom_emoji_id = emoji_status_custom_emoji_id;
                this.bio = bio;
                this.has_private_forwards = has_private_forwards;
                this.has_restricted_voice_and_video_messages = has_restricted_voice_and_video_messages;
                this.join_to_send_messages = join_to_send_messages;
                this.join_by_request = join_by_request;
                this.description = description;
                this.invite_link = invite_link;
                this.pinned_message = pinned_message ? new Type().message(pinned_message) : null;
                this.permissions = permissions ? new Type().ChatPermissions(permissions) : null;
                this.slow_mode_delay = slow_mode_delay;
                this.message_auto_delete_time = message_auto_delete_time;
                this.has_aggressive_anti_spam_enabled = has_aggressive_anti_spam_enabled;
                this.has_hidden_members = has_hidden_members;
                this.has_protected_content = has_protected_content;
                this.sticker_set_name = sticker_set_name;
                this.can_set_sticker_set = can_set_sticker_set;
                this.linked_chat_id = linked_chat_id;
                this.location = location ? new Type().ChatLocation(location) : null;
            }
        }
        return new Chat(params);
    }

    /**
     * Represents a Telegram message.
     * @method Message
     * @param {number} message_id - Unique message identifier.
     * @param {number} [message_thread_id] - Unique identifier of the message thread.
     * @param {Object} from - Sender, can be a user or a bot.
     * @param {Object} sender_chat - Sender chat, only for messages sent in channels.
     * @param {number} date - Date the message was sent in Unix time.
     * @param {Object} chat - Conversation the message belongs to.
     * @param {Object} [forward_from] - For forwarded messages, sender of the original message.
     * @param {Object} [forward_from_chat] - For messages forwarded from channels, information about the original channel.
     * @param {number} [forward_from_message_id] - For messages forwarded from channels, identifier of the original message in the channel.
     * @param {string} [forward_signature] - For messages forwarded from channels, signature of the post author if present.
     * @param {string} [forward_sender_name] - Sender's name for messages forwarded from users who disallow adding a link to their account in forwarded messages.
     * @param {number} [forward_date] - For forwarded messages, date the original message was sent in Unix time.
     * @param {boolean} [is_topic_message] - True, if the message is a channel post comment, or a community topic message.
     * @param {boolean} [is_automatic_forward] - True, if the message is automatically forwarded.
     * @param {Object} [reply_to_message] - For replies, the original message.
     * @param {Object} [via_bot] - Bot through which the message was sent.
     * @param {number} [edit_date] - Date the message was last edited in Unix time.
     * @param {boolean} [has_protected_content] - True, if the message contains a media file with a password, which should be used to decrypt the file.
     * @param {string} [media_group_id] - The unique identifier of a media message group this message belongs to.
     * @param {string} [author_signature] - Signature of the post author for messages in channels.
     * @param {string} [text] - For text messages, the actual UTF-8 text of the message, 0-4096 characters.
     * @param {Array} [entities] - For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text.
     * @param {Object} [animation] - Message is an animation, information about the animation.
     * @param {Object} [audio] - Message is an audio file, information about the file.
     * @param {Object} [document] - Message is a general file, information about the file.
     * @param {Array} [photo] - Message is a photo, information about the photo.
     * @param {Object} [sticker] - Message is a sticker, information about the sticker.
     * @param {Object} [video] - Message is a video, information about the video.
     * @param {Object} [video_note] - Message is a video note, information about the video message.
     * @param {Object} [voice] - Message is a voice message, information about the file.
     * @param {string} [caption] - Caption for the animation, audio, document, photo, video or voice, 0-1024 characters.
     * @param {Array} [caption_entities] - For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption.
     * @param {boolean} [has_media_spoiler] - True, if the message is a media file with a caption that should be spoilered to users.
     * @param {Object} [contact] - Message is a shared contact, information about the contact.
     * @param {Object} [dice] - Message is a dice with random value from 1 to 6.
     * @param {Object} [game] - Message is a game, information about the game.
     * @param {Object} [poll] - Message is a native poll, information about the poll.
     * @param {Object} [venue] - Message is a venue, information about the venue.
     * @param {Object} [location] - Message is a shared location, information about the location.
     * @param {Array} [new_chat_members] - New members that were added to the group or supergroup and information about them (the bot itself may be one of these members).
     * @param {Object} [left_chat_member] - A member was removed from the group, information about them (this member may be the bot itself).
     * @param {string} [new_chat_title] - A chat title was changed to this value.
     * @param {Array} [new_chat_photo] - A chat photo was change to this value.
     * @param {boolean} [delete_chat_photo] - Service message: the chat photo was deleted.
     * @param {boolean} [group_chat_created] - Service message: the group has been created.
     * @param {boolean} [supergroup_chat_created] - Service message: the supergroup has been created.
     * @param {boolean} [channel_chat_created] - Service message: the channel has been created.
     * @param {Object} [message_auto_delete_timer_changed] - Service message: auto-delete timer settings changed in the chat.
     * @param {number} [migrate_to_chat_id] - The group has been migrated to a supergroup with the specified identifier.
     * @param {number} [migrate_from_chat_id] - The supergroup has been migrated from a group with the specified identifier.
     * @param {Object} [pinned_message] - Specified message was pinned.
     * @param {Object} [invoice] - Message is an invoice for a payment, information about the invoice.
     * @param {Object} [successful_payment] - Message is a service message about a successful payment, information about the payment.
     * @param {Object} [user_shared] - The domain name of the website on which the user has logged in.
     * @param {Object} [chat_shared] - The domain name of the website on which the user has logged in.
     * @param {string} [connected_website] - Telegram Passport data has been shared with the bot.
     * @param {Object} [write_access_allowed] - Service message: the user has granted or revoked permission to enable or disable message editing.
     * @param {Object} [passport_data] - Telegram Passport data has been sent.
     * @param {Object} [proximity_alert_triggered] - Service message: a user in the chat triggered another user's proximity alert while sharing Live Location.
     * @param {Object} [forum_topic_created] - Service message: a new chat has been created.
     * @param {Object} [forum_topic_edited] - Service message: a chat title has been edited.
     * @param {Object} [forum_topic_closed] - Service message: a chat has been closed.
     * @param {Object} [forum_topic_reopened] - Service message: a chat has been reopened.
     * @param {Object} [general_forum_topic_hidden] - Service message: a chat has been hidden from the chat list.
     * @param {Object} [general_forum_topic_unhidden] - Service message: a chat has been unhidden from the chat list.
     * @param {Object} [video_chat_scheduled] - Service message: a video chat has been scheduled.
     * @param {Object} [video_chat_started] - Service message: a video chat has started.
     * @param {Object} [video_chat_ended] - Service message: a video chat has ended.
     * @param {Object} [video_chat_participants_invited] - Service message: new participants invited to a video chat.
     * @param {Object} [web_app_data] - Service message: the message contains a user's web app data.
     * @param {Object} [reply_markup] - Inline keyboard attached to the message.
     * @return {Message} - Returns a new Message object.
     */
    message(params = { message_id, message_thread_id, from, sender_chat, date, chat, forward_from, forward_from_chat, forward_from_message_id, forward_signature, forward_sender_name, forward_date, is_topic_message, is_automatic_forward, reply_to_message, via_bot, edit_date, has_protected_content, media_group_id, author_signature, text, entities, animation, audio, document, photo, sticker, video, video_note, voice, caption, caption_entities, has_media_spoiler, contact, dice, game, poll, venue, location, new_chat_members, left_chat_member, new_chat_title, new_chat_photo, delete_chat_photo, group_chat_created, supergroup_chat_created, channel_chat_created, message_auto_delete_timer_changed, migrate_to_chat_id, migrate_from_chat_id, pinned_message, invoice, successful_payment, user_shared, chat_shared, connected_website, write_access_allowed, passport_data, proximity_alert_triggered, forum_topic_created, forum_topic_edited, forum_topic_closed, forum_topic_reopened, general_forum_topic_hidden, general_forum_topic_unhidden, video_chat_scheduled, video_chat_started, video_chat_ended, video_chat_participants_invited, web_app_data, reply_markup }) {
        class Message {
            constructor({ message_id, message_thread_id, from, sender_chat, date, chat, forward_from, forward_from_chat, forward_from_message_id, forward_signature, forward_sender_name, forward_date, is_topic_message, is_automatic_forward, reply_to_message, via_bot, edit_date, has_protected_content, media_group_id, author_signature, text, entities, animation, audio, document, photo, sticker, video, video_note, voice, caption, caption_entities, has_media_spoiler, contact, dice, game, poll, venue, location, new_chat_members, left_chat_member, new_chat_title, new_chat_photo, delete_chat_photo, group_chat_created, supergroup_chat_created, channel_chat_created, message_auto_delete_timer_changed, migrate_to_chat_id, migrate_from_chat_id, pinned_message, invoice, successful_payment, user_shared, chat_shared, connected_website, write_access_allowed, passport_data, proximity_alert_triggered, forum_topic_created, forum_topic_edited, forum_topic_closed, forum_topic_reopened, general_forum_topic_hidden, general_forum_topic_unhidden, video_chat_scheduled, video_chat_started, video_chat_ended, video_chat_participants_invited, web_app_data, reply_markup }) {
                this.message_id = message_id;
                this.message_thread_id = message_thread_id;
                this.from = from ? new Type().user(from) : null;
                this.sender_chat = sender_chat ? new Type().chat(sender_chat) : null;
                this.date = date;
                this.chat = chat ? new Type().chat(chat) : null;
                this.forward_from = forward_from ? new Type().user(forward_from) : null;
                this.forward_from_chat = forward_from_chat ? new Type().chat(forward_from_chat) : null;
                this.forward_from_message_id = forward_from_message_id;
                this.forward_signature = forward_signature;
                this.forward_sender_name = forward_sender_name;
                this.forward_date = forward_date;
                this.is_topic_message = is_topic_message;
                this.is_automatic_forward = is_automatic_forward;
                this.reply_to_message = reply_to_message ? new Type().message(reply_to_message) : null;
                this.via_bot = via_bot ? new Type().user(via_bot) : null;
                this.edit_date = edit_date;
                this.has_protected_content = has_protected_content;
                this.media_group_id = media_group_id;
                this.author_signature = author_signature;
                this.text = text;
                this.entities = entities ? entities.map(element => {
                    return new Type().messageEntity(element)
                }) : null;
                this.animation = animation ? new Type().Animation(animation) : null;
                this.audio = audio ? new Type().Audio(audio) : null;
                this.document = document ? new Type().Document(document) : null;
                this.photo = photo ? photo.map(element => {
                    return new Type().PhotoSize(element)
                }) : null;
                this.sticker = sticker ? new Type().Sticker(sticker) : null;
                this.video = video ? new Type().Video(video) : null;
                this.video_note = video_note ? new Type().VideoNote(video_note) : null;
                this.voice = voice ? new Type().Voice(voice) : null;
                this.caption = caption;
                this.caption_entities = caption_entities ? caption_entities.map(element => {
                    return new Type().messageEntity(element);
                }) : null;
                this.has_media_spoiler = has_media_spoiler;
                this.contact = contact ? new Type().Contact(contact) : null;
                this.dice = dice ? new Type().Dice(dice) : null;
                this.game = game ? new Type().Game(game) : null;
                this.poll = poll ? new Type().Poll(poll) : null;
                this.venue = venue ? new Type().Venue(venue) : null;
                this.location = location ? new Type().Location(location) : null;
                this.new_chat_members = new_chat_members ? new_chat_members.map(element => {
                    return new Type().user(element)
                }) : null;
                this.left_chat_member = left_chat_member ? new Type().user(left_chat_member) : null;
                this.new_chat_title = new_chat_title;
                this.new_chat_photo = new_chat_photo;
                this.delete_chat_photo = delete_chat_photo;
                this.group_chat_created = group_chat_created;
                this.supergroup_chat_created = supergroup_chat_created;
                this.channel_chat_created = channel_chat_created;
                this.message_auto_delete_timer_changed = message_auto_delete_timer_changed ? new Type().MessageAutoDeleteTimerChanged(message_auto_delete_timer_changed) : null;
                this.migrate_to_chat_id = migrate_to_chat_id;
                this.migrate_from_chat_id = migrate_from_chat_id;
                this.pinned_message = pinned_message ? new Type().message(pinned_message) : null;
                this.invoice = invoice ? new Type().Invoice(invoice) : null;
                this.successful_payment = successful_payment ? new Type().SuccessfulPayment(successful_payment) : null;
                this.user_shared = user_shared ? new Type().userShared(user_shared) : null;
                this.chat_shared = chat_shared ? new Type().ChatShared(chat_shared) : null;
                this.connected_website = connected_website;
                this.write_access_allowed = write_access_allowed ? new Type().WriteAccessAllowed(write_access_allowed) : null;
                this.passport_data = passport_data ? new Type().PassportData(passport_data) : null;
                this.proximity_alert_triggered = proximity_alert_triggered ? new Type().ProximityAlertTriggered(proximity_alert_triggered) : null;
                this.forum_topic_created = forum_topic_created ? new Type().ForumTopicCreated(forum_topic_created) : null;
                this.forum_topic_edited = forum_topic_edited ? new Type().ForumTopicEdited(forum_topic_edited) : null;
                this.forum_topic_closed = forum_topic_closed ? new Type().ForumTopicClosed(forum_topic_closed) : null;
                this.forum_topic_reopened = forum_topic_reopened ? new Type().ForumTopicReopened(forum_topic_reopened) : null;
                this.general_forum_topic_hidden = general_forum_topic_hidden ? new Type().GeneralForumTopicUnhidden(general_forum_topic_hidden) : null;
                this.general_forum_topic_unhidden = general_forum_topic_unhidden ? new Type().GeneralForumTopicUnhidden(general_forum_topic_unhidden) : null;
                this.video_chat_scheduled = video_chat_scheduled ? new Type().VideoChatScheduled(video_chat_scheduled) : null;
                this.video_chat_started = video_chat_started ? new Type().VideoChatStarted(video_chat_started) : null;
                this.video_chat_ended = video_chat_ended ? new Type().VideoChatEnded(video_chat_ended) : null;
                this.video_chat_participants_invited = video_chat_participants_invited ? new Type().VideoChatParticipantsInvited(video_chat_participants_invited) : null;
                this.web_app_data = web_app_data ? new Type().WebAppData(web_app_data) : null;
                this.reply_markup = reply_markup ? new Type().inlineKeyboardMarkup(reply_markup) : null;
            }
        }
        return new Message(params);
    }

    /**
     * @method MessageId
     * @param {Object} params
     * @param {Number} params.message_id - The unique identifier for the target message
     * @returns {MessageId}
     */
    messageId(params = { message_id }) {
        class MessageId {
            constructor({ message_id }) {
                this.message_id = message_id;
            }
        }
        return new MessageId(params);
    }

    /**
     * @method MessageEntity
     * @param {String} type - The type of the entity
     * @param {Number} offset - The offset of the entity
     * @param {Number} length - The length of the entity
     * @param {String} url - The URL of the entity
     * @param {Object} user - The user associated with the entity
     * @param {String} language - The language of the entity
     * @param {String} custom_emoji_id - The custom emoji id of the entity
     * @returns {MessageEntity} A new MessageEntity object
     */
    messageEntity(params = { type, offset, length, url, user, language, custom_emoji_id }) {
        class MessageEntity {
            constructor({ type, offset, length, url, user, language, custom_emoji_id }) {
                this.type = type;
                this.offset = offset;
                this.length = length;
                this.url = url;
                this.user = user;
                this.language = language;
                this.custom_emoji_id = custom_emoji_id;
            }
        }
        return new MessageEntity(params);
    }

    /**
     * @method PhotoSize
     * @param {string} file_id - Unique identifier for this file
     * @param {string} file_unique_id - Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     * @param {number} width - Photo width
     * @param {number} height - Photo height
     * @param {number} file_size - File size
     * @returns {PhotoSize} A new PhotoSize object
     */
    PhotoSize(params = { file_id, file_unique_id, width, height, file_size }) {
        class PhotoSize {
            constructor({ file_id, file_unique_id, width, height, file_size }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.width = width;
                this.height = height;
                this.file_size = file_size;
            }
        }
        return new PhotoSize(params);
    }

    /**
     * @method Animation
     * @param {Object} params - Parameters for creating an Animation object
     * @param {String} params.file_id - Unique file identifier
     * @param {String} params.file_unique_id - Unique file identifier
     * @param {Number} params.width - Video width as defined by sender
     * @param {Number} params.height - Video height as defined by sender
     * @param {Number} params.duration - Duration of the video in seconds as defined by sender
     * @param {Object} params.thumbnail - Optional. Animation thumbnail as defined by sender
     * @param {String} params.file_name - Optional. Original animation filename as defined by sender
     * @param {String} params.mime_type - Optional. MIME type of the file as defined by sender
     * @param {Number} params.file_size - Optional. File size
     * @returns {Animation} - Returns an Animation object
     */
    Animation(params = { file_id, file_unique_id, width, height, duration, thumbnail, file_name, mime_type, file_size }) {
        class Animation {
            constructor({ file_id, file_unique_id, width, height, duration, thumbnail, file_name, mime_type, file_size }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.width = width;
                this.height = height;
                this.duration = duration;
                this.thumbnail = thumbnail;
                this.file_name = file_name;
                this.mime_type = mime_type;
                this.file_size = file_size;
            }
        }
        return new Animation(params);
    }

    /**
     * @method Audio
     * @param {String} file_id - Unique identifier for this file.
     * @param {String} file_unique_id - Unique identifier for this file, supposed to be the same over time and for different bots.
     * @param {Number} duration - Duration of the audio in seconds as defined by sender.
     * @param {String} performer - Performer of the audio as defined by sender or by audio tags.
     * @param {String} title - Title of the audio as defined by sender or by audio tags.
     * @param {String} file_name - Original filename as defined by sender.
     * @param {String} mime_type - MIME type of the file as defined by sender.
     * @param {Number} file_size - File size.
     * @param {Object} thumbnail - Thumbnail of the album cover to which the music file belongs.
     * @returns {Audio} An object containing the audio data.
     */
    Audio(params = { file_id, file_unique_id, duration, performer, title, file_name, mime_type, file_size, thumbnail }) {
        class Audio {
            constructor({ file_id, file_unique_id, duration, performer, title, file_name, mime_type, file_size, thumbnail }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.duration = duration;
                this.performer = performer;
                this.title = title;
                this.file_name = file_name;
                this.mime_type = mime_type;
                this.file_size = file_size;
                this.thumbnail = thumbnail ? new Type().PhotoSize(thumbnail) : null;
            }
        }
        return new Audio(params);
    }

    /**
     * @method Document
     * @param {String} file_id - The file ID of the document.
     * @param {String} file_unique_id - The unique ID of the document.
     * @param {Object} thumbnail - An object containing the thumbnail of the document.
     * @param {String} file_name - The name of the document.
     * @param {String} mime_type - The MIME type of the document.
     * @param {Number} file_size - The size of the document.
     * @returns {Document} A new Document object.
     */
    Document(params = { file_id, file_unique_id, thumbnail, file_name, mime_type, file_size }) {
        class Document {
            constructor({ file_id, file_unique_id, thumbnail, file_name, mime_type, file_size }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.thumbnail = thumbnail ? new Type().PhotoSize(thumbnail) : null;
                this.file_name = file_name;
                this.mime_type = mime_type;
                this.file_size = file_size;
            }
        }
        return new Document(params);
    }

    /**
     * @method Video
     * @param {String} file_id - Unique identifier for this file
     * @param {String} file_unique_id - Unique identifier for this file, which is supposed to be the same over time and for different bots
     * @param {Number} width - Video width as defined by sender
     * @param {Number} height - Video height as defined by sender
     * @param {Number} duration - Duration of the video in seconds as defined by sender
     * @param {Object} thumbnail - Optional. Video thumbnail
     * @param {String} file_name - Optional. Original filename as defined by sender
     * @param {String} mime_type - Optional. MIME type of the file as defined by sender
     * @param {Number} file_size - Optional. File size
     * @returns {Video} A new Video object
     */
    Video(params = { file_id, file_unique_id, width, height, duration, thumbnail, file_name, mime_type, file_size }) {
        class Video {
            constructor({ file_id, file_unique_id, width, height, duration, thumbnail, file_name, mime_type, file_size }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.width = width;
                this.height = height;
                this.duration = duration;
                this.thumbnail = thumbnail ? new Type().PhotoSize(thumbnail) : null;
                this.file_name = file_name;
                this.mime_type = mime_type;
                this.file_size = file_size;
            }
        }
        return new Video(params);
    }

    /**
     * @method VideoNote
     * @param {String} file_id - Unique identifier for this file.
     * @param {String} file_unique_id - Unique identifier for this file, supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     * @param {Number} length - Video width and height (diameter of the video message) as defined by sender.
     * @param {Number} duration - Duration of the video in seconds as defined by sender.
     * @param {Object} thumbnail - Optional. Video thumbnail.
     * @param {Number} file_size - Optional. File size.
     * @returns {VideoNote} A VideoNote object.
     */
    VideoNote(params = { file_id, file_unique_id, length, duration, thumbnail, file_size }) {
        class VideoNote {
            constructor({ file_id, file_unique_id, length, duration, thumbnail, file_size }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.length = length;
                this.duration = duration;
                this.thumbnail = thumbnail ? new Type().PhotoSize(thumbnail) : null;
                this.file_size = file_size;
            }
        }
        return new VideoNote(params);
    }

    /**
     * @method Voice
     * @param {String} file_id - Unique identifier for this file.
     * @param {String} file_unique_id - Unique identifier for this file, which is supposed to be the same over time and for different bots.
     * @param {Number} duration - Duration of the audio in seconds as defined by sender.
     * @param {String} mime_type - Optional. MIME type of the file as defined by sender.
     * @param {Number} file_size - Optional. File size.
     * @returns {Voice} A new Voice data type object.
     */
    Voice(params = { file_id, file_unique_id, duration, mime_type, file_size }) {
        class Voice {
            constructor({ file_id, file_unique_id, duration, mime_type, file_size }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.duration = duration;
                this.mime_type = mime_type;
                this.file_size = file_size;
            }
        }
        return new Voice(params);
    }

    /**
     * @method Contact
     * @param {Number} phone_number - Contact's phone number
     * @param {String} first_name - Contact's first name
     * @param {String} last_name - Optional. Contact's last name
     * @param {String} user_id - Optional. Contact's user identifier in Telegram
     * @param {String} vcard - Optional. Additional data about the contact in the form of a vCard
     * @returns {Contact} returns an instance of Contact
     */
    Contact(params = { phone_number, first_name, last_name, user_id, vcard }) {
        class Contact {
            constructor({ phone_number, first_name, last_name, user_id, vcard }) {
                this.phone_number = phone_number;
                this.first_name = first_name;
                this.last_name = last_name;
                this.user_id = user_id;
                this.vcard = vcard;
            }
        }
        return new Contact(params);
    }

    /**
     * @method Dice
     * @param {string} emoji - An emoji character
     * @param {number} value - A randomly generated number
     * @returns {Dice} A data type with emoji character and a random number
     */
    Dice(params = { emoji, value }) {
        class Dice {
            constructor(emoji, value) {
                this.emoji = emoji;
                this.value = value;
            }
        }
        return new Dice(emoji, value);
    }

    /** 
     * @method PollOption 
     * @param {String} text - Text of the PollOption object
     * @param {Number} voter_count - Voter count of the PollOption object
     * @returns {PollOption} A new object of PollOption 
     */
    PollOption(params = { text, voter_count }) {
        class PollOption {
            constructor(text, voter_count) {
                this.text = text;
                this.voter_count = voter_count;
            }
        }
        return new PollOption(text, voter_count);
    }

    /**
     * @method PollAnswer
     * @param {Number} poll_id - The ID of the poll.
     * @param {Object} user - A User object that contains data about the user who answered the poll.
     * @param {Number[]} option_ids - An array of vote option IDs, chosen by the user. 
     * @return {PollAnswer} An object representing the poll answer.
     */
    PollAnswer(params = { poll_id, user, option_ids }) {
        class PollAnswer {
            constructor(poll_id, user, option_ids) {
                this.poll_id = poll_id;
                this.user = user ? new Type().user(user) : null;
                this.option_ids = option_ids;
            }
        }
        return new PollAnswer(poll_id, user, option_ids);
    }

    /**
   * @method Poll
   * @param {String} id - The identifier for the poll
   * @param {String} question - The poll question, 1-255 characters
   * @param {Array<Object>} options - List of poll options 
   * @param {Number} total_voter_count - Number of users that voted in the poll 
   * @param {Boolean} is_closed - True, if the poll is closed 
   * @param {Boolean} is_anonymous - True, if the poll is anonymous 
   * @param {String} type - Type of poll, can be “regular” or “quiz”
   * @param {Boolean} allows_multiple_answers - True, if the poll allows multiple answers 
   * @param {String} correct_option_id - 0-based identifier of the correct option in a quiz poll 
   * @param {String} explanation - Text that is shown when a user chooses an incorrect answer in a quiz poll
   * @param {Array<Object>} explanation_entities - Special entities like usernames, URLs, bot commands, etc. that appear in the explanation
   * @param {Number} open_period - Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with close_date
   * @param {Number} close_date - Point in time (Unix timestamp) when the poll will be automatically closed 
   * @returns {Poll} A new instance of the Poll object
   */
    Poll(params = { id, question, options, total_voter_count, is_closed, is_anonymous, type, allows_multiple_answers, correct_option_id, explanation, explanation_entities, open_period, close_date }) {
        class Poll {
            constructor({ id, question, options, total_voter_count, is_closed, is_anonymous, type, allows_multiple_answers, correct_option_id, explanation, explanation_entities, open_period, close_date }) {
                this.id = id;
                this.question = question;
                this.options = options;
                this.total_voter_count = total_voter_count;
                this.is_closed = is_closed;
                this.is_anonymous = is_anonymous;
                this.type = type;
                this.allows_multiple_answers = allows_multiple_answers;
                this.correct_option_id = correct_option_id;
                this.explanation = explanation;
                this.explanation_entities = explanation_entities;
                this.open_period = open_period;
                this.close_date = close_date;
            }
        }
        return new Poll(params);
    }

    /**
     * @method Location 
     * @param {Number} longitude - Longitude as defined by sender
     * @param {Number} latitude - Latitude as defined by sender
     * @param {Number} horizontal_accuracy - Optional. The radius of uncertainty for the location, measured in meters; 0-1500
     * @param {Number} live_period - Optional. Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only.
     * @param {Number} heading - Optional. The direction in which user is moving, in degrees; 1-360. For active live locations only.
     * @param {Number} proximity_alert_radius - Optional. The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only.
     * @returns {Location} An object containing the location data
     */
    Location(params = { longitude, latitude, horizontal_accuracy, live_period, heading, proximity_alert_radius }) {
        class Location {
            constructor({ longitude, latitude, horizontal_accuracy, live_period, heading, proximity_alert_radius }) {
                this.longitude = longitude;
                this.latitude = latitude;
                this.horizontal_accuracy = horizontal_accuracy;
                this.live_period = live_period;
                this.heading = heading;
                this.proximity_alert_radius = proximity_alert_radius;
            }
        }
        return new Location(params);
    }

    /**
     * @method Venue
     * @param {Object} location - The location of the venue.
     * @param {String} title - The title of the venue.
     * @param {String} address - The address of the venue.
     * @param {String} foursquare_id - Optional. The foursquare ID of the venue.
     * @param {String} foursquare_type - Optional. The foursquare type of the venue.
     * @param {String} google_place_id - Optional. The Google Place ID of the venue.
     * @param {String} google_place_type - Optional. The Google Place type of the venue.
     * @returns {Venue} An object containing the venue data
     */
    Venue(params = { location, title, address, foursquare_id, foursquare_type, google_place_id, google_place_type }) {
        class Venue {
            constructor({ location, title, address, foursquare_id, foursquare_type, google_place_id, google_place_type }) {
                this.location = new Type().Location(location);
                this.title = title;
                this.address = address;
                this.foursquare_id = foursquare_id;
                this.foursquare_type = foursquare_type;
                this.google_place_id = google_place_id;
                this.google_place_type = google_place_type;
            }
        }
        return new Venue(params);
    }

    /**
     * @method WebAppData
     * @param {string} data - Data Value.
     * @param {string} button_text - Data button text.
     * @returns {WebAppData} - WebAppData object.
     */
    WebAppData(params = { data, button_text }) {
        class WebAppData {
            constructor({ data, button_text }) {
                this.data = data;
                this.button_text = button_text;
            }
        }
        return new WebAppData(params);
    }

    /**
     * @method ProximityAlertTriggered
     * @param {object} traveler - A traveler object.
     * @param {object} watcher - A watcher object.
     * @param {number} distance - The distance between the traveler and watcher.
     * @returns {ProximityAlertTriggered} - A ProximityAlertTriggered object.
     */
    ProximityAlertTriggered(params = { traveler, watcher, distance }) {
        class ProximityAlertTriggered {
            constructor({ traveler, watcher, distance }) {
                this.traveler = traveler ? new Type().user(traveler) : null;
                this.watcher = watcher ? new Type().user(watcher) : null;
                this.distance = distance;
            }
        }
        return new ProximityAlertTriggered(params);
    }

    /**
     * @method MessageAutoDeleteTimerChanged
     * @param {number} message_auto_delete_time - time in seconds when telegram bot will delete a message
     * @return {MessageAutoDeleteTimerChanged} object with the message auto delete time
     */
    MessageAutoDeleteTimerChanged(params = { message_auto_delete_time }) {
        class MessageAutoDeleteTimerChanged {
            constructor({ message_auto_delete_time }) {
                this.message_auto_delete_time = message_auto_delete_time;
            }
        }
        return new MessageAutoDeleteTimerChanged(params);
    }

    /**
     * @method ForumTopicCreated
     * @param {String} name - Name of the topic.
     * @param {String} icon_color - Color of the topic icon in RGB format.
     * @param {String} icon_custom_emoji_id - Unique identifier of the custom emoji shown as the topic icon.
     * @returns {ForumTopicCreated} An object representing a forum topic that was created.
     */
    ForumTopicCreated(params = { name, icon_color, icon_custom_emoji_id }) {
        class ForumTopicCreated {
            constructor({ name, icon_color, icon_custom_emoji_id }) {
                this.name = name;
                this.icon_color = icon_color;
                this.icon_custom_emoji_id = icon_custom_emoji_id;
            }
        }
        return new ForumTopicCreated(params);
    }

    /**
     * @method ForumTopicClosed
     * @param {String} topic_id - Identifier of the topic.
     * @returns {ForumTopicClosed} An object representing a closed forum topic.
     */
    ForumTopicClosed(params = { topic_id }) {
        class ForumTopicClosed {
            constructor({ topic_id }) {
                this.topic_id = topic_id;
            }
        }
        return new ForumTopicClosed(params);
    }

    /**
     * @method ForumTopicEdited
     * @param {String} name - The name of the edited topic.
     * @param {String} icon_custom_emoji_id - The custom emoji id, if any.
     * @returns {ForumTopicEdited} An object representing an edited forum topic.
     */
    ForumTopicEdited(params = { name, icon_custom_emoji_id }) {
        class ForumTopicEdited {
            constructor({ name, icon_custom_emoji_id }) {
                this.name = name;
                this.icon_custom_emoji_id = icon_custom_emoji_id;
            }
        }
        return new ForumTopicEdited(params);
    }

    /**
     * @method ForumTopicReopened
     * @param {String} topic_id - Identifier of the topic.
     * @returns {ForumTopicReopened} An object representing a reopened forum topic.
     */
    ForumTopicReopened(params = { topic_id }) {
        class ForumTopicReopened {
            constructor({ topic_id }) {
                this.topic_id = topic_id;
            }
        }
        return new ForumTopicReopened(params);
    }

    /**
     * @method GeneralForumTopicHidden
     * @param {String} topic_id - Identifier of the topic.
     * @returns {GeneralForumTopicHidden} An object representing a hidden general forum topic.
     */
    GeneralForumTopicHidden(params = { topic_id }) {
        class GeneralForumTopicHidden {
            constructor({ topic_id }) {
                this.topic_id = topic_id;
            }
        }
        return new GeneralForumTopicHidden(params);
    }

    /**
     * @method GeneralForumTopicUnhidden
     * @param {String} topic_id - Identifier of the topic.
     * @returns {GeneralForumTopicUnhidden} An object representing an unhidden general forum topic.
     */
    GeneralForumTopicUnhidden(params = { topic_id }) {
        class GeneralForumTopicUnhidden {
            constructor({ topic_id }) {
                this.topic_id = topic_id;
            }
        }
        return new GeneralForumTopicUnhidden(params);
    }

    /**
     * @method UserShared
     * @param {Number} request_id - The request ID.
     * @param {Number} user_id - The user ID.
     * @returns {UserShared} The new data type as an object.
     */
    userShared(params = { request_id, user_id }) {
        class UserShared {
            constructor({ request_id, user_id }) {
                this.request_id = request_id;
                this.user_id = user_id;
            }
        }
        return new UserShared(params);
    }

    /**
     * @method ChatShared
     * @param {String} request_id - Request id 
     * @param {String} chat_id - Chat id 
     * @returns {ChatShared}
     */
    ChatShared(params = { request_id, chat_id }) {
        class ChatShared {
            constructor({ request_id, chat_id }) {
                this.request_id = request_id;
                this.chat_id = chat_id;
            }
        }
        return new ChatShared(request_id, chat_id);
    }

    /** 
     * @method WriteAccessAllowed
     * @param {Object} params - The parameters used to create the WriteAccessAllowed instance
     * @returns {WriteAccessAllowed}
     */
    WriteAccessAllowed(params = {}) {
        class WriteAccessAllowed {
            constructor(params) {
                this.params = params;
            }
        }
        return new WriteAccessAllowed(params);
    }

    /**
     * @method VideoChatScheduled
     * @param {Date} start_date - Start date of the Video Chat
     * @return {VideoChatScheduled}
     */
    VideoChatScheduled(params = { start_date }) {
        class VideoChatScheduled {
            constructor({ start_date }) {
                this.start_date = start_date;
            }
        }
        return new VideoChatScheduled(params);
    }

    /**
     * @method VideoChatStarted
     * @param {Object} params - Object with parameters
     * @returns {VideoChatStarted} A video chat started object.
     */
    VideoChatStarted(params = { params }) {
        class VideoChatStarted {
            constructor({ params }) {
                this.params = params;
            }
        }
        return new VideoChatStarted(params);
    }

    /**
     * @method VideoChatEnded
     * @param {number} duration - Duration of the video chat in seconds.
     * @returns {VideoChatEnded} An object representing the end of a video chat.
     */
    VideoChatEnded(params = { duration }) {
        class VideoChatEnded {
            constructor({ duration }) {
                this.duration = duration;
            }
        }
        return new VideoChatEnded(params);
    }

    /**
     * @method VideoChatParticipantsInvited
     * @param {Array.<Type.User>} users - a list of type User objects
     * @returns {VideoChatParticipantsInvited} - new VideoChatParticipantsInvited object return
     */
    VideoChatParticipantsInvited(params = { users }) {
        class VideoChatParticipantsInvited {
            constructor({ users }) {
                this.users = users.map(element => element ? new Type().user(element) : null);
            }
        }
        return new VideoChatParticipantsInvited(params);
    }

    /**
     * @method UserProfilePhotos
     * @param {number} total_count - Total count of photos.
     * @param {Array.<Array.<PhotoSize>>} photos - List of photo sizes in different sizes.
     * @returns {UserProfilePhotos} Returns a UserProfilePhotos instance.
     */
    userProfilePhotos(params = { total_count, photos }) {
        class UserProfilePhotos {
            constructor({ total_count, photos }) {
                this.total_count = total_count;
                this.photos = photos.map(photoSet => photoSet.map(photo => new Type().PhotoSize(photo)));
            }
        }
        return new UserProfilePhotos(params);
    }

    /**
     * @method File
     * @description This method creates a new File object
     * @param {string} file_id - The unique identifier of the file
     * @param {string} file_unique_id - The unique ID of the file
     * @param {number} file_size - The size of the file
     * @param {string} file_path - The path of the file
     * @returns {File} A File object
     */
    File(params = { file_id, file_unique_id, file_size, file_path }) {
        class File {
            constructor({ file_id, file_unique_id, file_size, file_path }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.file_size = file_size;
                this.file_path = file_path;
            }
        }
        return new File(params);
    }

    /**
     * @method WebAppInfo
     * @param {String} url - An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps
     * @return {WebAppInfo}
     */
    WebAppInfo(params = { url }) {
        class WebAppInfo {
            constructor({ url }) {
                this.url = url;
            }
        }
        return new WebAppInfo(params);
    }

    /**
     * @method ReplyKeyboardMarkup
     * @param {Array} keyboard Array of Array of KeyboardButton objects representing the keyboard.
     * @param {Boolean} [is_persistent=false] Whether the reply keyboard will remain active after first use.
     * @param {Boolean} [resize_keyboard=false] Whether the keyboard must be resized to fit all the buttons.
     * @param {Boolean} [one_time_keyboard=false] Requests clients to hide the keyboard as soon as it's been used.
     * @param {String} [input_field_placeholder] The text that appears in the input field.
     * @param {Boolean} [selective=false] Use this parameter selectively.
     * @returns {ReplyKeyboardMarkup} Returns an object representing a ReplyKeyboardMarkup object.
     */
    ReplyKeyboardMarkup(params = { keyboard, is_persistent, resize_keyboard, one_time_keyboard, input_field_placeholder, selective }) {
        class ReplyKeyboardMarkup {
            constructor({ keyboard, is_persistent, resize_keyboard, one_time_keyboard, input_field_placeholder, selective }) {
                this.keyboard = keyboard.map(row => row.map(button => new Type().KeyboardButton(button)));
                this.is_persistent = is_persistent;
                this.resize_keyboard = resize_keyboard;
                this.one_time_keyboard = one_time_keyboard;
                this.input_field_placeholder = input_field_placeholder;
                this.selective = selective;
            }
        }
        return new ReplyKeyboardMarkup(params);
    }

    /**
     * @method KeyboardButton
     * @param {String} text - Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed
     * @param {KeyboardButtonRequestUser} request_user - Optional. If specified, pressing the button will open a list of suitable users. Tapping on any user will send their identifier to the bot in a “user_shared” service message. Available in private chats only.
     * @param {KeyboardButtonRequestChat} request_chat - Optional. If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a “chat_shared” service message. Available in private chats only.
     * @param {Boolean} request_contact - Optional. If True, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only.
     * @param {Boolean} request_location - Optional. If True, the user's current location will be sent when the button is pressed. Available in private chats only.
     * @param {KeyboardButtonPollType} request_poll - Optional. If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only.
     * @param {WebAppInfo} web_app - Optional. If specified, the described Web App will be launched when the button is pressed. The Web App will be able to send a “web_app_data” service message. Available in private chats only.
     * @returns {KeyboardButton} An object representing a keyboard button.
     */
    KeyboardButton(params = { text, request_user, request_chat, request_contact, request_location, request_poll, web_app }) {
        class KeyboardButton {
            constructor({ text, request_user, request_chat, request_contact, request_location, request_poll, web_app }) {
                this.text = text;
                this.request_user = request_user ? new Type().KeyboardButtonRequestUser(request_user) : null;
                this.request_chat = request_chat ? new Type().KeyboardButtonRequestChat(request_chat) : null;
                this.request_contact = request_contact;
                this.request_location = request_location;
                this.request_poll = request_poll ? new Type().KeyboardButtonPollType(request_poll) : null;
                this.web_app = web_app ? new Type().WebAppInfo(web_app) : null;
            }
        }
        return new KeyboardButton(params);
    }

    /**
     * @method KeyboardButtonRequestUser  
     * @param {String} request_id - A unique identifier of the request you can use to travel back to the bot.  
     * @param {Boolean} user_is_bot - Describes if a user is bot or not.
     * @param {Boolean} user_is_premium - Describes if a user is a premium subscriber or not.
     * @returns {KeyboardButtonRequestUser}
     */
    KeyboardButtonRequestUser(params = { request_id, user_is_bot, user_is_premium }) {
        class KeyboardButtonRequestUser {
            constructor({ request_id, user_is_bot, user_is_premium }) {
                this.request_id = request_id;
                this.user_is_bot = user_is_bot;
                this.user_is_premium = user_is_premium;
            }
        }
        return new KeyboardButtonRequestUser(params);
    }

    /**
     * Returns a KeyboardButtonRequestChat object with parameters for Telegram bot API
     * @method KeyboardButtonRequestChat
     * @param {Number} request_id - Id of the request
     * @param {Boolean} chat_is_channel - Is chat a channel
     * @param {Boolean} chat_is_forum - Is chat a forum
     * @param {Boolean} chat_has_username - Does chat have a username
     * @param {Boolean} chat_is_created - Is chat created
     * @param {Object} user_administrator_rights - Chat administrator rights of the user
     * @param {Object} bot_administrator_rights - Chat administrator rights of the bot
     * @param {Boolean} bot_is_member - Is bot a member of the chat
     * @returns {KeyboardButtonRequestChat} - A KeyboardButtonRequestChat object
     */
    KeyboardButtonRequestChat(params = { request_id, chat_is_channel, chat_is_forum, chat_has_username, chat_is_created, user_administrator_rights, bot_administrator_rights, bot_is_member }) {
        class KeyboardButtonRequestChat {
            constructor({ request_id, chat_is_channel, chat_is_forum, chat_has_username, chat_is_created, user_administrator_rights, bot_administrator_rights, bot_is_member }) {
                this.request_id = request_id;
                this.chat_is_channel = chat_is_channel;
                this.chat_is_forum = chat_is_forum;
                this.chat_has_username = chat_has_username;
                this.chat_is_created = chat_is_created;
                this.user_administrator_rights = user_administrator_rights ? new Type().ChatAdministratorRights(user_administrator_rights) : null;
                this.bot_administrator_rights = bot_administrator_rights ? new Type().ChatAdministratorRights(bot_administrator_rights) : null;
                this.bot_is_member = bot_is_member;
            }
        }
        return new KeyboardButtonRequestChat(params);
    }

    /**
     * @method KeyboardButtonPollType
     * @param {String} type - Parameter specifying the type of a button used to create the poll 
     * @returns {KeyboardButtonPollType}
     */
    KeyboardButtonPollType(params = { type }) {
        class KeyboardButtonPollType {
            constructor({ type }) {
                this.type = type;
            }
        }
        return new KeyboardButtonPollType(params);
    }

    /**
     * @method ReplyKeyboardRemove
     * @param {boolean} remove_keyboard - Requests clients to remove the custom keyboard
     * @param {boolean} selective - Use this parameter if you want to remove the keyboard for specific users only
     * @returns {ReplyKeyboardRemove} A ReplyKeyboardRemove object
     */
    ReplyKeyboardRemove(params = { remove_keyboard, selective }) {
        class ReplyKeyboardRemove {
            constructor({ remove_keyboard, selective }) {
                this.remove_keyboard = remove_keyboard;
                this.selective = selective;
            }
        }
        return new ReplyKeyboardRemove(params);
    }

    /**
     * @method InlineKeyboardMarkup
     * @param {Array} inline_keyboard - An array of arrays of InlineKeyboardButton objects
     * @returns {InlineKeyboardMarkup} An InlineKeyboardMarkup object
     */
    inlineKeyboardMarkup(params = { inline_keyboard }) {
        class InlineKeyboardMarkup {
            constructor({ inline_keyboard }) {
                this.inline_keyboard = inline_keyboard.map(element_1 =>
                    element_1.map(element_2 =>
                        new Type().inlineKeyboardButton(element_2)
                    )
                );
            }
        }
        return new InlineKeyboardMarkup(params);
    }

    /**
     * @method InlineKeyboardButton
     * @param {String} text - Label text on the button
     * @param {String} url - HTTP or tg:// url to be opened when button is pressed
     * @param {String} callback_data - Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes
     * @param {Object} web_app - A WebAppInfo object for a web page that will be opened via a button
     * @param {Object} login_url - A LoginUrl object for a web page that will be opened via a button
     * @param {String} switch_inline_query - If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot‘s username and the specified inline query in the input field. Can be empty, in which case just the bot’s username will be inserted.
     * @param {String} switch_inline_query_current_chat - If set, pressing the button will insert the bot‘s username and the specified inline query in the current chat's input field. Can be empty, in which case just the bot’s username will be inserted.
     * @param {Object} callback_game - Description of the game that will be launched when the user presses the button
     * @param {Boolean} pay - Specify True, to send a Pay button
     * @returns {InlineKeyboardButton} An InlineKeyboardButton object
     */
    inlineKeyboardButton(params = { text, url, callback_data, web_app, login_url, switch_inline_query, switch_inline_query_current_chat, callback_game, pay }) {
        class InlineKeyboardButton {
            constructor({ text, url, callback_data, web_app, login_url, switch_inline_query, switch_inline_query_current_chat, callback_game, pay }) {
                this.text = text;
                this.url = url;
                this.callback_data = callback_data;
                this.web_app = web_app ? new Type().WebAppInfo(web_app) : null;
                this.login_url = login_url ? new Type().LoginUrl(login_url) : null;
                this.switch_inline_query = switch_inline_query;
                this.switch_inline_query_current_chat = switch_inline_query_current_chat;
                this.callback_game = callback_game ? new Type().CallbackGame(callback_game) : null;
                this.pay = pay;
            }
        }
        return new InlineKeyboardButton(params);
    }

    /**
     * Creates a new LoginUrl object
     * 
     * @method LoginUrl
     * @param {String} url - The URL of the login page
     * @param {String} forward_text - The text to be displayed on the login page
     * @param {String} bot_username - The username of the bot
     * @param {Boolean} request_write_access - Whether or not to request write access
     * @returns {LoginUrl} A new LoginUrl object
     */
    LoginUrl(params = { url, forward_text, bot_username, request_write_access }) {
        class LoginUrl {
            constructor({ url, forward_text, bot_username, request_write_access }) {
                this.url = url;
                this.forward_text = forward_text;
                this.bot_username = bot_username;
                this.request_write_access = request_write_access;
            }
        }
        return new LoginUrl(params);
    }

    /**
   * Creates a new CallbackQuery object
   * 
   * @method CallbackQuery
   * @param {String} id - Unique identifier for this query
   * @param {Object} from - Sender
   * @param {Object} message - Message with the callback button that originated the query
   * @param {String} inline_message_id - Identifier of the message sent via the bot in inline mode, that originated the query
   * @param {String} chat_instance - Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent
   * @param {String} data - Data associated with the callback button
   * @param {String} game_short_name - Short name of a Game to be returned, serves as the unique identifier for the game
   * @returns {CallbackQuery} A new CallbackQuery object
   */
    callbackQuery(params = { id, from, message, inline_message_id, chat_instance, data, game_short_name }) {
        class CallbackQuery {
            constructor({ id, from, message, inline_message_id, chat_instance, data, game_short_name }) {
                this.id = id;
                this.from = from ? new Type().user(from) : null;
                this.message = new Type().message(message);
                this.inline_message_id = inline_message_id;
                this.chat_instance = chat_instance;
                this.data = data;
                this.game_short_name = game_short_name;
            }
        }
        return new callbackQuery(params);
    }

    /**
     * Creates a new ForceReply object
     * 
     * @method ForceReply
     * @param {boolean} force_reply - Shows reply interface to the user, as if they manually selected the bot's message and tapped 'Reply'
     * @param {string} input_field_placeholder - Optional. Placeholder text of the form
     * @param {boolean} selective - Optional. Use this parameter if you want to force reply from specific users only
     * @returns {ForceReply} A new ForceReply object
     */
    ForceReply(params = { force_reply, input_field_placeholder, selective }) {
        class ForceReply {
            constructor({ force_reply, input_field_placeholder, selective }) {
                this.force_reply = force_reply;
                this.input_field_placeholder = input_field_placeholder;
                this.selective = selective;
            }
        }
        return new ForceReply(params);
    }

    /**
     * Creates a new ChatPhoto object
     *
     * @method ChatPhoto
     * @param {String} small_file_id - The file_id of the small version of the photo
     * @param {String} small_file_unique_id - The unique_id of the small version of the photo
     * @param {String} big_file_id - The file_id of the big version of the photo
     * @param {String} big_file_unique_id - The unique_id of the big version of the photo
     * @returns {ChatPhoto} A new ChatPhoto object
     */
    ChatPhoto(params = { small_file_id, small_file_unique_id, big_file_id, big_file_unique_id }) {
        class ChatPhoto {
            constructor({ small_file_id, small_file_unique_id, big_file_id, big_file_unique_id }) {
                this.small_file_id = small_file_id;
                this.small_file_unique_id = small_file_unique_id;
                this.big_file_id = big_file_id;
                this.big_file_unique_id = big_file_unique_id;
            }
        }
        return new ChatPhoto(params);
    }

    /**
     * @method ChatInviteLink
     * @param {String} invite_link - The invite link. Can't be null.
     * @param {Object} creator - The creator of the chat. An User object. Can't be null.
     * @param {Boolean} creates_join_request - Whether the link creates a join request.
     * @param {Boolean} is_primary - Whether it's a primary invite link.
     * @param {Boolean} is_revoked - Whether the link is revoked.
     * @param {String} name - The name of the invite link.
     * @param {Date} expire_date - Expiration date of the invite link.
     * @param {Number} member_limit - Maximum number of users that can be members of the chat simultaneously after joining the chat via this link.
     * @param {Number} pending_join_request_count - Number of pending join requests. Returns only in getChatInviteLink and exportChatInviteLink methods.
     * @returns {ChatInviteLink} A new ChatInviteLink object.
     */
    ChatInviteLink(params = { invite_link, creator, creates_join_request, is_primary, is_revoked, name, expire_date, member_limit, pending_join_request_count }) {
        class ChatInviteLink {
            constructor({ invite_link, creator, creates_join_request, is_primary, is_revoked, name, expire_date, member_limit, pending_join_request_count }) {
                this.invite_link = invite_link;
                this.creator = creator ? new Type().user(creator) : null;
                this.creates_join_request = creates_join_request;
                this.is_primary = is_primary;
                this.is_revoked = is_revoked;
                this.name = name;
                this.expire_date = expire_date;
                this.member_limit = member_limit;
                this.pending_join_request_count = pending_join_request_count;
            }
        }
        return new ChatInviteLink(params);
    }

    /**
     * @method ChatAdministratorRights
     * @param {boolean} is_anonymous - Indicates if the administrator is anonymous
     * @param {boolean} can_manage_chat - Indicates if the administrator can manage the chat
     * @param {boolean} can_delete_messages - Indicates if the administrator can delete messages
     * @param {boolean} can_manage_video_chats - Indicates if the administrator can manage video chats
     * @param {boolean} can_restrict_members - Indicates if the administrator can restrict members
     * @param {boolean} can_promote_members - Indicates if the administrator can promote members
     * @param {boolean} can_change_info - Indicates if the administrator can change info
     * @param {boolean} can_invite_users - Indicates if the administrator can invite users
     * @param {boolean} can_post_messages - Indicates if the administrator can post messages
     * @param {boolean} can_edit_messages - Indicates if the administrator can edit messages
     * @param {boolean} can_pin_messages - Indicates if the administrator can pin messages
     * @param {boolean} can_manage_topics - Indicates if the administrator can manage topics
     * @returns {ChatAdministratorRights} An object containing the ChatAdministratorRights
     */
    ChatAdministratorRights(params = { is_anonymous, can_manage_chat, can_delete_messages, can_manage_video_chats, can_restrict_members, can_promote_members, can_change_info, can_invite_users, can_post_messages, can_edit_messages, can_pin_messages, can_manage_topics }) {
        class ChatAdministratorRights {
            constructor(is_anonymous, can_manage_chat, can_delete_messages, can_manage_video_chats, can_restrict_members, can_promote_members, can_change_info, can_invite_users, can_post_messages, can_edit_messages, can_pin_messages, can_manage_topics) {
                this.is_anonymous = is_anonymous;
                this.can_manage_chat = can_manage_chat;
                this.can_delete_messages = can_delete_messages;
                this.can_manage_video_chats = can_manage_video_chats;
                this.can_restrict_members = can_restrict_members;
                this.can_promote_members = can_promote_members;
                this.can_change_info = can_change_info;
                this.can_invite_users = can_invite_users;
                this.can_post_messages = can_post_messages;
                this.can_edit_messages = can_edit_messages;
                this.can_pin_messages = can_pin_messages;
                this.can_manage_topics = can_manage_topics;
            }
        }
        return new ChatAdministratorRights(is_anonymous, can_manage_chat, can_delete_messages, can_manage_video_chats, can_restrict_members, can_promote_members, can_change_info, can_invite_users, can_post_messages, can_edit_messages, can_pin_messages, can_manage_topics);
    }

    ChatMember(params = { can_add_web_page_previews, can_be_edited, can_change_info, can_delete_messages, can_edit_messages, can_invite_users, can_manage_chat, can_manage_topics, can_manage_video_chats, can_pin_messages, can_post_messages, can_promote_members, can_restrict_members, can_send_audios, can_send_documents, can_send_messages, can_send_other_messages, can_send_photos, can_send_polls, can_send_video_notes, can_send_videos, can_send_voice_notes, custom_title, is_anonymous, is_member, status, until_date, user }) {
        switch (status) {
            case 'creator':
                return new Type().ChatMemberOwner(status, user, is_anonymous, custom_title);
            case 'administrator':
                return new Type().ChatMemberAdministrator(status, user, can_be_edited, is_anonymous, can_manage_chat, can_delete_messages, can_manage_video_chats, can_restrict_members, can_promote_members, can_change_info, can_invite_users, can_post_messages, can_edit_messages, can_pin_messages, can_manage_topics, custom_title);
            case 'member':
                return new Type().ChatMemberMember(status, user);
            case 'restricted':
                return new Type().ChatMemberRestricted(status, user, is_member, can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, can_send_voice_notes, can_send_polls, can_send_other_messages, can_add_web_page_previews, can_change_info, can_invite_users, can_pin_messages, can_manage_topics, until_date);
            case 'left':
                return new Type().ChatMemberLeft(status, user);
            case 'kicked':
                return new Type().ChatMemberBanned(status, user, until_date);
        }
    }

    /**
     * @method ChatMemberOwner
     * @param {String} status - The status of the user in the chat
     * @param {User} user - An object containing the user's information
     * @param {Boolean} is_anonymous - Whether the user is anonymous or not
     * @param {String} custom_title - The custom title of the user
     * @returns {ChatMemberOwner} A new ChatMemberOwner object
     */
    ChatMemberOwner(params = { status, user, is_anonymous, custom_title }) {
        class ChatMemberOwner {
            constructor(status, user, is_anonymous, custom_title) {
                this.status = status;
                this.user = user;
                this.is_anonymous = is_anonymous;
                this.custom_title = custom_title;
            }
        }
        return new ChatMemberOwner(status, user, is_anonymous, custom_title);
    }

    /**
     * @method ChatMemberAdministrator
     * @param {String} status - The status of the user in the chat
     * @param {User} user - The user object
     * @param {Boolean} can_be_edited - Whether the user can be edited
     * @param {Boolean} is_anonymous - Whether the user is anonymous
     * @param {Boolean} can_manage_chat - Whether the user can manage the chat
     * @param {Boolean} can_delete_messages - Whether the user can delete messages
     * @param {Boolean} can_manage_video_chats - Whether the user can manage video chats
     * @param {Boolean} can_restrict_members - Whether the user can restrict members
     * @param {Boolean} can_promote_members - Whether the user can promote members
     * @param {Boolean} can_change_info - Whether the user can change info
     * @param {Boolean} can_invite_users - Whether the user can invite users
     * @param {Boolean} can_post_messages - Whether the user can post messages
     * @param {Boolean} can_edit_messages - Whether the user can edit messages
     * @param {Boolean} can_pin_messages - Whether the user can pin messages
     * @param {Boolean} can_manage_topics - Whether the user can manage topics
     * @param {String} custom_title - The custom title of the user
     * @returns {ChatMemberAdministrator} A new ChatMemberAdministrator object
     */
    ChatMemberAdministrator(params = { status, user, can_be_edited, is_anonymous, can_manage_chat, can_delete_messages, can_manage_video_chats, can_restrict_members, can_promote_members, can_change_info, can_invite_users, can_post_messages, can_edit_messages, can_pin_messages, can_manage_topics, custom_title }) {
        class ChatMemberAdministrator {
            constructor(status, user, can_be_edited, is_anonymous, can_manage_chat, can_delete_messages, can_manage_video_chats, can_restrict_members, can_promote_members, can_change_info, can_invite_users, can_post_messages, can_edit_messages, can_pin_messages, can_manage_topics, custom_title) {
                this.status = status;
                this.user = user;
                this.can_be_edited = can_be_edited;
                this.is_anonymous = is_anonymous;
                this.can_manage_chat = can_manage_chat;
                this.can_delete_messages = can_delete_messages;
                this.can_manage_video_chats = can_manage_video_chats;
                this.can_restrict_members = can_restrict_members;
                this.can_promote_members = can_promote_members;
                this.can_change_info = can_change_info;
                this.can_invite_users = can_invite_users;
                this.can_post_messages = can_post_messages;
                this.can_edit_messages = can_edit_messages;
                this.can_pin_messages = can_pin_messages;
                this.can_manage_topics = can_manage_topics;
                this.custom_title = custom_title;
            }
        }
        return new ChatMemberAdministrator(status, user, can_be_edited, is_anonymous, can_manage_chat, can_delete_messages, can_manage_video_chats, can_restrict_members, can_promote_members, can_change_info, can_invite_users, can_post_messages, can_edit_messages, can_pin_messages, can_manage_topics, custom_title);
    }

    /**
     * @method ChatMemberMember
     * @param {String} status - The member's status in the chat, always “member”
     * @param {User} user - Information about the user
     * @returns {ChatMemberMember} A new ChatMemberMember object
     */
    ChatMemberMember(params = { status, user }) {
        class ChatMemberMember {
            constructor(status, user) {
                this.status = status;
                this.user = user;
            }
        }
        return new ChatMemberMember(status, user);
    }

    /**
     * @method ChatMemberRestricted
     * @param {String} status - The status of the chat member
     * @param {User} user - The user object of the chat member
     * @param {Boolean} is_member - Whether the user is a member of the chat
     * @param {Boolean} can_send_messages - Whether the user can send messages
     * @param {Boolean} can_send_audios - Whether the user can send audios
     * @param {Boolean} can_send_documents - Whether the user can send documents
     * @param {Boolean} can_send_photos - Whether the user can send photos
     * @param {Boolean} can_send_videos - Whether the user can send videos
     * @param {Boolean} can_send_video_notes - Whether the user can send video notes
     * @param {Boolean} can_send_voice_notes - Whether the user can send voice notes
     * @param {Boolean} can_send_polls - Whether the user can send polls
     * @param {Boolean} can_send_other_messages - Whether the user can send other messages
     * @param {Boolean} can_add_web_page_previews - Whether the user can add web page previews
     * @param {Boolean} can_change_info - Whether the user can change info
     * @param {Boolean} can_invite_users - Whether the user can invite users
     * @param {Boolean} can_pin_messages - Whether the user can pin messages
     * @param {Boolean} can_manage_topics - Whether the user can manage topics
     * @param {Number} until_date - The date until which the user is restricted
     * @returns {ChatMemberRestricted} A new ChatMemberRestricted object
     */
    ChatMemberRestricted(params = { status, user, is_member, can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, can_send_voice_notes, can_send_polls, can_send_other_messages, can_add_web_page_previews, can_change_info, can_invite_users, can_pin_messages, can_manage_topics, until_date }) {
        class ChatMemberRestricted {
            constructor(status, user, is_member, can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, can_send_voice_notes, can_send_polls, can_send_other_messages, can_add_web_page_previews, can_change_info, can_invite_users, can_pin_messages, can_manage_topics, until_date) {
                this.status = status;
                this.user = user;
                this.is_member = is_member;
                this.can_send_messages = can_send_messages;
                this.can_send_audios = can_send_audios;
                this.can_send_documents = can_send_documents;
                this.can_send_photos = can_send_photos;
                this.can_send_videos = can_send_videos;
                this.can_send_video_notes = can_send_video_notes;
                this.can_send_voice_notes = can_send_voice_notes;
                this.can_send_polls = can_send_polls;
                this.can_send_other_messages = can_send_other_messages;
                this.can_add_web_page_previews = can_add_web_page_previews;
                this.can_change_info = can_change_info;
                this.can_invite_users = can_invite_users;
                this.can_pin_messages = can_pin_messages;
                this.can_manage_topics = can_manage_topics;
                this.until_date = until_date;
            }
        }
        return new ChatMemberRestricted(status, user, is_member, can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, can_send_voice_notes, can_send_polls, can_send_other_messages, can_add_web_page_previews, can_change_info, can_invite_users, can_pin_messages, can_manage_topics, until_date);
    }

    /**
     * @method ChatMemberLeft
     * @param {String} status - The member's status in the chat, always “left”
     * @param {Object} user - Information about the user
     * @returns {ChatMemberLeft} A new ChatMemberLeft object
     */
    ChatMemberLeft(params = { status, user }) {
        class ChatMemberLeft {
            constructor({ status, user }) {
                this.status = status;
                this.user = user ? new Type().user(user) : null;
            }
        }
        return new ChatMemberLeft(params);
    }

    /**
     * @method ChatMemberBanned
     * @param {String} status - The status of the user in the chat
     * @param {Object} user - The user object
     * @param {Number} until_date - The date until which the user is banned
     * @returns {ChatMemberBanned}
     */
    ChatMemberBanned(params = { status, user, until_date }) {
        class ChatMemberBanned {
            constructor({ status, user, until_date }) {
                this.status = status;
                this.user = user ? new Type().user(user) : null;
                this.until_date = until_date;
            }
        }
        return new ChatMemberBanned(params);
    }

    /**
     * @method ChatMemberUpdated
     * @param {Object} chat - The chat object
     * @param {Object} from - The user object of the user who initiated the update
     * @param {Date} date - The date of the update
     * @param {Object} old_chat_member - The old chat member object
     * @param {Object} new_chat_member - The new chat member object
     * @param {String} invite_link - The invite link for the chat
     * @returns {ChatMemberUpdated} A new ChatMemberUpdated object
     */
    ChatMemberUpdated(params = { chat, from, date, old_chat_member, new_chat_member, invite_link }) {
        class ChatMemberUpdated {
            constructor({ chat, from, date, old_chat_member, new_chat_member, invite_link }) {
                this.chat = chat ? new Type().chat(chat) : null;
                this.from = from ? new Type().user(from) : null;
                this.date = date;
                this.old_chat_member = old_chat_member ? new Type().ChatMember(old_chat_member) : null;
                this.new_chat_member = new_chat_member ? new Type().ChatMember(new_chat_member) : null;
                this.invite_link = invite_link ? new Type().ChatInviteLink(invite_link) : null;
            }
        }
        return new ChatMemberUpdated(params);
    }

    /**
     * @method ChatJoinRequest
     * @param {Chat} chat - The chat object
     * @param {User} from - The user object
     * @param {Number} user_chat_id - The user chat id
     * @param {Date} date - The date of the request
     * @param {String} bio - The user bio
     * @param {ChatInviteLink} invite_link - The invite link
     * @returns {ChatJoinRequest} - A new ChatJoinRequest object
     */
    ChatJoinRequest(params = { chat, from, user_chat_id, date, bio, invite_link }) {
        class ChatJoinRequest {
            constructor({ chat, from, user_chat_id, date, bio, invite_link }) {
                this.chat = chat ? new Type().chat(chat) : null;
                this.from = from ? new Type().user(from) : null;
                this.user_chat_id = user_chat_id;
                this.date = date;
                this.bio = bio;
                this.invite_link = invite_link ? new Type().ChatInviteLink(invite_link) : null;
            }
        }
        return new ChatJoinRequest(params);
    }

    /**
     * @method ChatPermissions
     * @param {boolean} can_send_messages - Whether the user can send messages
     * @param {boolean} can_send_audios - Whether the user can send audios
     * @param {boolean} can_send_documents - Whether the user can send documents
     * @param {boolean} can_send_photos - Whether the user can send photos
     * @param {boolean} can_send_videos - Whether the user can send videos
     * @param {boolean} can_send_video_notes - Whether the user can send video notes
     * @param {boolean} can_send_voice_notes - Whether the user can send voice notes
     * @param {boolean} can_send_polls - Whether the user can send polls
     * @param {boolean} can_send_other_messages - Whether the user can send other messages
     * @param {boolean} can_add_web_page_previews - Whether the user can add web page previews
     * @param {boolean} can_change_info - Whether the user can change info
     * @param {boolean} can_invite_users - Whether the user can invite users
     * @param {boolean} can_pin_messages - Whether the user can pin messages
     * @param {boolean} can_manage_topics - Whether the user can manage topics
     * @returns {ChatPermissions} A new ChatPermissions object
     */
    ChatPermissions(params = { can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, can_send_voice_notes, can_send_polls, can_send_other_messages, can_add_web_page_previews, can_change_info, can_invite_users, can_pin_messages, can_manage_topics }) {
        class ChatPermissions {
            constructor({ can_send_messages, can_send_audios, can_send_documents, can_send_photos, can_send_videos, can_send_video_notes, can_send_voice_notes, can_send_polls, can_send_other_messages, can_add_web_page_previews, can_change_info, can_invite_users, can_pin_messages, can_manage_topics }) {
                this.can_send_messages = can_send_messages;
                this.can_send_audios = can_send_audios;
                this.can_send_documents = can_send_documents;
                this.can_send_photos = can_send_photos;
                this.can_send_videos = can_send_videos;
                this.can_send_video_notes = can_send_video_notes;
                this.can_send_voice_notes = can_send_voice_notes;
                this.can_send_polls = can_send_polls;
                this.can_send_other_messages = can_send_other_messages;
                this.can_add_web_page_previews = can_add_web_page_previews;
                this.can_change_info = can_change_info;
                this.can_invite_users = can_invite_users;
                this.can_pin_messages = can_pin_messages;
                this.can_manage_topics = can_manage_topics;
            }
        }
        return new ChatPermissions(params);
    }

    /**
     * @method ChatLocation
     * @param {Location} location - The location of the ChatLocation
     * @param {String} address - The address of the ChatLocation
     * @returns {ChatLocation} - A new ChatLocation object
     */
    ChatLocation(params = { location, address }) {
        class ChatLocation {
            constructor(location, address) {
                this.location = location;
                this.address = address;
            }
        }
        return new ChatLocation(location, address);
    }

    /**
     * @method ForumTopic
     * @param {string} message_thread_id - The ID of the message thread
     * @param {string} name - The name of the forum topic
     * @param {string} icon_color - The color of the forum topic icon
     * @param {string} icon_custom_emoji_id - The ID of the custom emoji for the forum topic icon
     * @returns {ForumTopic} A new ForumTopic object
     */
    ForumTopic(params = { message_thread_id, name, icon_color, icon_custom_emoji_id }) {
        class ForumTopic {
            constructor(message_thread_id, name, icon_color, icon_custom_emoji_id) {
                this.message_thread_id = message_thread_id;
                this.name = name;
                this.icon_color = icon_color;
                this.icon_custom_emoji_id = icon_custom_emoji_id;
            }
        }
        return new ForumTopic(message_thread_id, name, icon_color, icon_custom_emoji_id);
    }

    /**
     * @method BotCommand
     * @param {String} command - The command for the BotCommand
     * @param {String} description - The description for the BotCommand
     * @returns {BotCommand} - A new BotCommand object
     */
    BotCommand(params = { command, description }) {
        class BotCommand {
            constructor(command, description) {
                this.command = command;
                this.description = description;
            }
        }
        return new BotCommand(command, description);
    }

    BotCommandScope(params = { type, chat_id, user_id }) {
        switch (type) {
            case 'all_private_chats':
                return new Type().BotCommandScopeAllPrivateChats(type);
            case 'all_group_chats':
                return new Type().BotCommandScopeAllGroupChats(type);
            case 'all_chat_administrators':
                return new Type().BotCommandScopeAllChatAdministrators(type, chat_id);
            case 'chat':
                return new Type().BotCommandScopeChat(type, chat_id);
            case 'chat_administrators':
                return new Type().BotCommandScopeChatAdministrators(type, chat_id);
            case 'chat_member':
                return new Type().BotCommandScopeChatMember(type, chat_id, user_id);
            default:
                return new Type().BotCommandScopeDefault(type);
        }
    }

    /**
     * @method BotCommandScopeDefault
     * @param {String} type - Scope type, must be default
     * @returns {BotCommandScopeDefault}
     */
    BotCommandScopeDefault(params = { type }) {
        class BotCommandScopeDefault {
            constructor(type) {
                this.type = type;
            }
        }
        return new BotCommandScopeDefault(type);
    }

    /**
     * @method BotCommandScopeAllPrivateChats
     * @param {String} type - Scope type, must be all_private_chats
     * @returns {BotCommandScopeAllPrivateChats}
     */
    BotCommandScopeAllPrivateChats(params = { type }) {
        class BotCommandScopeAllPrivateChats {
            constructor(type) {
                this.type = type;
            }
        }
        return new BotCommandScopeAllPrivateChats(type);
    }

    /**
     * @method BotCommandScopeAllGroupChats
     * @param {String} type - Scope type, must be all_group_chats
     * @returns {BotCommandScopeAllGroupChats}
     */
    BotCommandScopeAllGroupChats(params = { type }) {
        class BotCommandScopeAllGroupChats {
            constructor(type) {
                this.type = type;
            }
        }
        return new BotCommandScopeAllGroupChats(type);
    }

    /**
     * @method BotCommandScopeAllChatAdministrators
     * @param {String} type - Scope type, must be all_chat_administrators
     * @param {Number} chat_id - Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @returns {BotCommandScopeAllChatAdministrators}
     */
    BotCommandScopeAllChatAdministrators(params = { type, chat_id }) {
        class BotCommandScopeAllChatAdministrators {
            constructor(type, chat_id) {
                this.type = type;
                this.chat_id = chat_id;
            }
        }
        return new BotCommandScopeAllChatAdministrators(type, chat_id);
    }

    /**
     * @method BotCommandScopeChat
     * @param {String} type - The type of the bot command scope chat
     * @param {Number} chat_id - The chat id of the bot command scope chat
     * @returns {BotCommandScopeChat} - A new BotCommandScopeChat object
     */
    BotCommandScopeChat(params = { type, chat_id }) {
        class BotCommandScopeChat {
            constructor(type, chat_id) {
                this.type = type;
                this.chat_id = chat_id;
            }
        }
        return new BotCommandScopeChat(type, chat_id);
    }

    /**
     * @method BotCommandScopeChatAdministrators
     * @param {String} type - Scope type, must be chat_administrators
     * @param {Number} chat_id - Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @returns {BotCommandScopeChatAdministrators} - A new BotCommandScopeChatAdministrators object
     */
    BotCommandScopeChatAdministrators(params = { type, chat_id }) {
        class BotCommandScopeChatAdministrators {
            constructor(type, chat_id) {
                this.type = type;
                this.chat_id = chat_id;
            }
        }
        return new BotCommandScopeChatAdministrators(type, chat_id);
    }

    /**
     * @method BotCommandScopeChatMember
     * @param {String} type - Scope type, must be chat_member
     * @param {Number} chat_id - Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param {Number} user_id - Unique identifier of the target user
     * @returns {BotCommandScopeChatMember} A new BotCommandScopeChatMember object
     */
    BotCommandScopeChatMember(params = { type, chat_id, user_id }) {
        class BotCommandScopeChatMember {
            constructor(type, chat_id, user_id) {
                this.type = type;
                this.chat_id = chat_id;
                this.user_id = user_id;
            }
        }
        return new BotCommandScopeChatMember(type, chat_id, user_id);
    }

    /**
     * @method BotDescription
     * @param {String} description - The description of the bot
     * @returns {BotDescription} A new BotDescription object
     */
    BotDescription(params = { description }) {
        class BotDescription {
            constructor(description) {
                this.description = description;
            }
        }
        return new BotDescription(description);
    }

    /**
     * @method BotShortDescription
     * @param {String} short_description - The bot's short description
     * @returns {BotShortDescription} A new BotShortDescription object
     */
    BotShortDescription(params = { short_description }) {
        class BotShortDescription {
            constructor(short_description) {
                this.short_description = short_description;
            }
        }
        return new BotShortDescription(short_description);
    }

    MenuButton(params = { type, text, web_app }) {
        switch (type) {
            case 'commands':
                return new Type().MenuButtonCommands(type);
            case 'web_app':
                return new Type().MenuButtonWebApp(type, text, web_app);
            default:
                return new Type().MenuButtonDefault(type);
        }
    }

    /**
     * @method MenuButtonCommands
     * @param {String} type - Type of the button, must be commands
     * @returns {MenuButtonCommands} A new MenuButtonCommands object
     */
    MenuButtonCommands(params = { type }) {
        class MenuButtonCommands {
            constructor(type) {
                this.type = type;
            }
        }
        return new MenuButtonCommands(type);
    }

    /**
     * @method MenuButtonWebApp
     * @param {String} type - The type of the button
     * @param {String} text - The text of the button
     * @param {WebAppInfo} web_app - The web app of the button
     * @returns {MenuButtonWebApp} A new MenuButtonWebApp object
     */
    MenuButtonWebApp(params = { type, text, web_app }) {
        class MenuButtonWebApp {
            constructor(type, text, web_app) {
                this.type = type;
                this.text = text;
                this.web_app = web_app ? new Type().WebAppInfo(web_app) : null;
            }
        }
        return new MenuButtonWebApp(type, text, web_app);
    }

    /**
     * @method MenuButtonDefault
     * @param {String} type - Type of the button, must be default
     * @returns {MenuButtonDefault} A new MenuButtonDefault object
     */
    MenuButtonDefault(params = { type }) {
        class MenuButtonDefault {
            constructor(type) {
                this.type = type;
            }
        }
        return new MenuButtonDefault(type);
    }

    /**
     * @method ResponseParameters
     * @param {Number} migrate_to_chat_id - The chat id to migrate to
     * @param {Number} retry_after - The time to wait before retrying
     * @returns {ResponseParameters} A new ResponseParameters object
     */
    ResponseParameters(params = { migrate_to_chat_id, retry_after }) {
        class ResponseParameters {
            constructor(migrate_to_chat_id, retry_after) {
                this.migrate_to_chat_id = migrate_to_chat_id;
                this.retry_after = retry_after;
            }
        }
        return new ResponseParameters(migrate_to_chat_id, retry_after);
    }

    InputMedia(params = { type, media, caption, parse_mode, caption_entities, has_spoiler, thumbnail, width, height, duration, supports_streaming, performer, title, disable_content_type_detection }) {
        switch (type) {
            case 'photo':
                return new Type().InputMediaPhoto(type, media, caption, parse_mode, caption_entities, has_spoiler);
            case 'video':
                return new Type().InputMediaVideo(type, media, thumbnail, caption, parse_mode, caption_entities, width, height, duration, supports_streaming, has_spoiler);
            case 'animation':
                return new Type().InputMediaAnimation(type, media, thumbnail, caption, parse_mode, caption_entities, width, height, duration, has_spoiler);
            case 'audio':
                return new Type().InputMediaAudio(type, media, thumbnail, caption, parse_mode, caption_entities, duration, performer, title);
            case 'document':
                return new Type().InputMediaDocument(type, media, thumbnail, caption, parse_mode, caption_entities, disable_content_type_detection);
        }
    }

    /**
     * @method InputMediaPhoto
     * @param {String} type - The type of the media
     * @param {String} media - The media file to send
     * @param {String} caption - The caption of the media
     * @param {String} parse_mode - The parse mode of the caption
     * @param {Array} caption_entities - An array of caption entities
     * @param {Boolean} has_spoiler - Whether the media contains a spoiler
     * @returns {InputMediaPhoto} - A new InputMediaPhoto object
     */
    InputMediaPhoto(params = { type, media, caption, parse_mode, caption_entities, has_spoiler }) {
        class InputMediaPhoto {
            constructor({ type, media, caption, parse_mode, caption_entities, has_spoiler }) {
                this.type = type;
                this.media = media;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.has_spoiler = has_spoiler;
            }
        }
        return new InputMediaPhoto(params);
    }

    /**
     * @method InputMediaVideo
     * @param {String} type - The type of the media
     * @param {String} media - File to send
     * @param {InputFile|String} thumbnail - Optional. Thumbnail of the file sent
     * @param {String} caption - Optional. Caption of the video to be sent, 0-1024 characters
     * @param {String} parse_mode - Optional. Send Markdown or HTML
     * @param {Object} caption_entities - Optional. List of special entities that appear in the caption
     * @param {Number} width - Optional. Video width
     * @param {Number} height - Optional. Video height
     * @param {Number} duration - Optional. Video duration
     * @param {Boolean} supports_streaming - Optional. Pass True, if the uploaded video is suitable for streaming
     * @param {Boolean} has_spoiler - Optional. Pass True, if the uploaded video contains a spoiler
     * @returns {InputMediaVideo} A new InputMediaVideo object
     */
    InputMediaVideo(params = { type, media, thumbnail, caption, parse_mode, caption_entities, width, height, duration, supports_streaming, has_spoiler }) {
        class InputMediaVideo {
            constructor({ type, media, thumbnail, caption, parse_mode, caption_entities, width, height, duration, supports_streaming, has_spoiler }) {
                this.type = type;
                this.media = media;
                this.thumbnail = thumbnail;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.width = width;
                this.height = height;
                this.duration = duration;
                this.supports_streaming = supports_streaming;
                this.has_spoiler = has_spoiler;
            }
        }
        return new InputMediaVideo(params);
    }

    /**
     * @method InputMediaAnimation
     * @param {String} type - The type of the media
     * @param {String} media - File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name
     * @param {InputFile|String} thumbnail - Optional. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side
     * @param {String} caption - Caption of the animation to be sent, 0-1024 characters
     * @param {String} parse_mode - Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption
     * @param {Object[]} caption_entities - List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param {Number} width - Animation width
     * @param {Number} height - Animation height
     * @param {Number} duration - Animation duration
     * @param {Boolean} has_spoiler - Pass True, if the uploaded animation is suitable for sensitive content
     * @returns {InputMediaAnimation} A new InputMediaAnimation object
     */
    InputMediaAnimation(params = { type, media, thumbnail, caption, parse_mode, caption_entities, width, height, duration, has_spoiler }) {
        class InputMediaAnimation {
            constructor({ type, media, thumbnail, caption, parse_mode, caption_entities, width, height, duration, has_spoiler }) {
                this.type = type;
                this.media = media;
                this.thumbnail = thumbnail;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.width = width;
                this.height = height;
                this.duration = duration;
                this.has_spoiler = has_spoiler;
            }
        }
        return new InputMediaAnimation(params);
    }

    /**
     * @method InputMediaAudio
     * @param {String} type - The type of the media
     * @param {String} media - File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name
     * @param {InputFile|String} thumbnail - Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail‘s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data
     * @param {String} caption - Caption of the audio to be sent, 0-1024 characters
     * @param {String} parse_mode - Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in the media caption
     * @param {Object[]} caption_entities - List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param {Number} duration - Duration of the audio in seconds
     * @param {String} performer - Performer of the audio
     * @param {String} title - Title of the audio
     * @returns {InputMediaAudio} A new InputMediaAudio object
     */
    InputMediaAudio(params = { type, media, thumbnail, caption, parse_mode, caption_entities, duration, performer, title }) {
        class InputMediaAudio {
            constructor({ type, media, thumbnail, caption, parse_mode, caption_entities, duration, performer, title }) {
                this.type = type;
                this.media = media;
                this.thumbnail = thumbnail;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.duration = duration;
                this.performer = performer;
                this.title = title;
            }
        }
        return new InputMediaAudio(params);
    }

    /**
     * @method InputMediaDocument
     * @param {String} type - The type of the media
     * @param {String} media - The file ID of the media
     * @param {InputFile|String} thumbnail - The file ID of the thumbnail
     * @param {String} caption - The caption of the media
     * @param {String} parse_mode - The parse mode of the caption
     * @param {Object} caption_entities - The caption entities of the caption
     * @param {Boolean} disable_content_type_detection - Whether to disable content type detection
     * @returns {InputMediaDocument} A new InputMediaDocument object
     */
    InputMediaDocument(params = { type, media, thumbnail, caption, parse_mode, caption_entities, disable_content_type_detection }) {
        class InputMediaDocument {
            constructor({ type, media, thumbnail, caption, parse_mode, caption_entities, disable_content_type_detection }) {
                this.type = type;
                this.media = media;
                this.thumbnail = thumbnail;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.disable_content_type_detection = disable_content_type_detection;
            }
        }
        return new InputMediaDocument(params);
    }

    /**
     * @method InputFile
     * @param {String|Blob} file - The file to be sent. It can be either a file ID, a URL, or a Blob object representing the file data.
     * @param {String} [filename] - Optional. The name of the file.
     * @returns {InputFile} An object representing the input file.
     */
    InputFile(params = { file, filename }) {
        class InputFile {
            constructor({ file, filename }) {
                this.file = file;
                this.filename = filename;
            }
        }

        // Check the type of the file parameter
        if (typeof file === 'string') {
            // The file is already stored on Telegram servers (file ID or URL)
            const isFileId = /^[a-zA-Z0-9-_]{20}$/.test(file);
            const isUrl = /^https?:\/\//i.test(file);

            if (!isFileId && !isUrl) {
                throw new Error('Invalid file parameter. It should be a file ID or a URL.');
            }
        } else if (!(file instanceof Blob)) {
            throw new Error('Invalid file parameter. It should be a file ID, a URL, or a Blob object.');
        }

        return new InputFile(params);
    }


    // Stickers

    /**
     * @method Sticker
     * @param {String} file_id - The unique identifier for this file
     * @param {String} file_unique_id - The unique identifier for this file
     * @param {String} type - The type of the file (usually 'sticker')
     * @param {Number} width - The width of the sticker
     * @param {Number} height - The height of the sticker
     * @param {Boolean} is_animated - Whether the sticker is animated
     * @param {Boolean} is_video - Whether the sticker is a video
     * @param {Object} thumbnail - An object containing the thumbnail of the sticker
     * @param {String} emoji - The emoji associated with the sticker
     * @param {String} set_name - The name of the sticker set
     * @param {Object} premium_animation - Whether the sticker has premium animation
     * @param {Object} mask_position - An object containing the position of the mask
     * @param {String} custom_emoji_id - The unique identifier for the custom emoji
     * @param {Boolean} needs_repainting - Whether the sticker needs repainting
     * @param {Number} file_size - The size of the file
     * @returns {Sticker} A new Sticker object
     */
    Sticker(params = { file_id, file_unique_id, type, width, height, is_animated, is_video, thumbnail, emoji, set_name, premium_animation, mask_position, custom_emoji_id, needs_repainting, file_size }) {
        class Sticker {
            constructor({ file_id, file_unique_id, type, width, height, is_animated, is_video, thumbnail, emoji, set_name, premium_animation, mask_position, custom_emoji_id, needs_repainting, file_size }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.type = type;
                this.width = width;
                this.height = height;
                this.is_animated = is_animated;
                this.is_video = is_video;
                this.thumbnail = thumbnail ? new Type().PhotoSize(thumbnail) : null;
                this.emoji = emoji;
                this.set_name = set_name;
                this.premium_animation = premium_animation ? new Type().File(premium_animation) : null;
                this.mask_position = mask_position ? new Type().MaskPosition(mask_position) : null;
                this.custom_emoji_id = custom_emoji_id;
                this.needs_repainting = needs_repainting;
                this.file_size = file_size;
            }
        }
        return new Sticker(params);
    }

    /**
     * @method StickerSet
     * @param {String} name - The name of the StickerSet
     * @param {String} title - The title of the StickerSet
     * @param {String} sticker_type - The type of the StickerSet
     * @param {Boolean} is_animated - Whether the StickerSet is animated
     * @param {Boolean} is_video - Whether the StickerSet is a video
     * @param {Array} stickers - An array of stickers in the StickerSet
     * @param {Object} thumbnail - An object containing the thumbnail of the StickerSet
     * @returns {StickerSet} A new StickerSet object
     */
    StickerSet(params = { name, title, sticker_type, is_animated, is_video, stickers, thumbnail }) {
        class StickerSet {
            constructor(name, title, sticker_type, is_animated, is_video, stickers, thumbnail) {
                this.name = name;
                this.title = title;
                this.sticker_type = sticker_type;
                this.is_animated = is_animated;
                this.is_video = is_video;
                this.stickers = stickers;
                this.thumbnail = thumbnail;
            }
        }
        return new StickerSet(name, title, sticker_type, is_animated, is_video, stickers, thumbnail);
    }

    /**
     * @method MaskPosition
     * @param {String} point - The part of the face relative to which the mask should be placed
     * @param {Number} x_shift - Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position
     * @param {Number} y_shift - Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position
     * @param {Number} scale - Mask scaling coefficient. For example, 2.0 means double size
     * @returns {MaskPosition} A new MaskPosition object
     */
    MaskPosition(params = { point, x_shift, y_shift, scale }) {
        class MaskPosition {
            constructor({ point, x_shift, y_shift, scale }) {
                this.point = point;
                this.x_shift = x_shift;
                this.y_shift = y_shift;
                this.scale = scale;
            }
        }
        return new MaskPosition(params);
    }

    /**
     * @method InputSticker
     * @param {InputFile|String} sticker - The sticker object
     * @param {Array} emoji_list - An array of emoji strings
     * @param {MaskPosition} mask_position - The position of the mask
     * @param {Array} keywords - An array of keywords
     * @returns {InputSticker} A new InputSticker object
     */
    InputSticker(params = { sticker, emoji_list, mask_position, keywords }) {
        class InputSticker {
            constructor({ sticker, emoji_list, mask_position, keywords }) {
                this.sticker = sticker;
                this.emoji_list = emoji_list;
                this.mask_position = mask_position ? new Type().MaskPosition(mask_position) : null;
                this.keywords = keywords;
            }
        }
        return new InputSticker(params);
    }

    // Inline mode

    /**
     * @method InlineQuery
     * @param {String} id - Unique identifier for this query
     * @param {Object} from - Sender
     * @param {String} query - Text of the query
     * @param {String} offset - Offset of the results to be returned, can be controlled by the bot
     * @param {String} chat_type - Type of the chat, from which the inline query was sent
     * @param {Object} location - Location of the user, only if relevant
     * @returns {InlineQuery} A new InlineQuery object
     */
    InlineQuery(params = { id, from, query, offset, chat_type, location }) {
        class InlineQuery {
            constructor({ id, from, query, offset, chat_type, location }) {
                this.id = id;
                this.from = from ? new Type().user(from) : null;
                this.query = query;
                this.offset = offset;
                this.chat_type = chat_type;
                this.location = location ? new Type().Location(location) : null;
            }
        }
        return new InlineQuery(params);
    }

    InlineQueryResult(params = { params }) {
        switch (params.type) {
            case 'article':  // /banCheck
                return new Type().InlineQueryResultArticle(params);
            case 'photo':
                if (params.photo_file_id) {
                    return new Type().InlineQueryResultCachedPhoto(params);
                } else {
                    return new Type().InlineQueryResultPhoto(params);
                }
            case 'gif':
                if (params.gif_file_id) {
                    return new Type().InlineQueryResultCachedGif(params);
                } else {
                    return new Type().InlineQueryResultGif(params);
                }
            case 'mpeg4_gif':
                if (params.mpeg4_file_id) {
                    return new Type().InlineQueryResultCachedMpeg4Gif(params);
                } else {
                    return new Type().InlineQueryResultMpeg4Gif(params);
                }
            case 'video':
                if (params.video_file_id) {
                    return new Type().InlineQueryResultCachedVideo(params);
                } else {
                    return new Type().InlineQueryResultVideo(params);
                }
            case 'audio':
                if (params.audio_file_id) {
                    return new Type().InlineQueryResultCachedAudio(params);
                } else {
                    return new Type().InlineQueryResultAudio(params);
                }
            case 'voice':
                if (params.voice_file_id) {
                    return new Type().InlineQueryResultCachedVoice(params);
                } else {
                    return new Type().InlineQueryResultVoice(params);
                }
            case 'document':
                if (params.document_file_id) {
                    return new Type().InlineQueryResultCachedDocument(params);
                } else {
                    return new Type().InlineQueryResultDocument(params);
                }
            case 'location':
                return new Type().InlineQueryResultLocation(params);
            case 'venue':
                return new Type().InlineQueryResultVenue(params);
            case 'contact':
                return new Type().InlineQueryResultContact(params);
            case 'game':
                return new Type().InlineQueryResultGame(params);
        }
    }

    /**
     * @method InlineQueryResultCachedAudio
     * @param {String} type - Type of the result, must be audio
     * @param {String} id - Unique identifier for this result, 1-64 bytes
     * @param {String} audio_file_id - A valid file identifier for the audio file
     * @param {String} [caption] - Caption of the audio to be sent, 0-1024 characters after entities parsing
     * @param {String} [parse_mode] - Mode for parsing entities in the audio caption
     * @param {Array} [caption_entities] - List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param {Object} [reply_markup] - Inline keyboard attached to the message
     * @param {Object} [input_message_content] - Content of the message to be sent instead of the audio
     * @returns {InlineQueryResultCachedAudio} A new InlineQueryResultCachedAudio object
     */
    InlineQueryResultCachedAudio(params = { type, id, audio_file_id, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultCachedAudio {
            constructor(type, id, audio_file_id, caption, parse_mode, caption_entities, reply_markup, input_message_content) {
                this.type = type;
                this.id = id;
                this.audio_file_id = audio_file_id;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultCachedAudio(type, id, audio_file_id, caption, parse_mode, caption_entities, reply_markup, input_message_content);
    }

    /**
     * @method InlineQueryResultCachedDocument
     * @param {String} type - Type of the result, must be document
     * @param {String} id - Unique identifier for this result, 1-64 bytes
     * @param {String} title - Title for the result
     * @param {String} document_file_id - A valid file identifier for the document
     * @param {String} [description] - Short description of the result
     * @param {String} [caption] - Caption of the document to be sent, 0-1024 characters after entities parsing
     * @param {String} [parse_mode] - Mode for parsing entities in the document caption
     * @param {Array} [caption_entities] - List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param {Object} [reply_markup] - Inline keyboard attached to the message
     * @param {Object} [input_message_content] - Content of the message to be sent instead of the document
     * @returns {InlineQueryResultCachedDocument} A new InlineQueryResultCachedDocument object
     */
    InlineQueryResultCachedDocument(params = { type, id, title, document_file_id, description, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultCachedDocument {
            constructor({ type, id, title, document_file_id, description, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.title = title;
                this.document_file_id = document_file_id;
                this.description = description;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultCachedDocument(params);
    }

    /**
     * @method InlineQueryResultCachedGif
     * @param {String} type - Type of the result, must be gif
     * @param {String} id - Unique identifier for this result, 1-64 bytes
     * @param {String} gif_file_id - A valid file identifier for the GIF file
     * @param {String} [title] - Title for the result
     * @param {String} [caption] - Caption of the GIF file to be sent, 0-1024 characters after entities parsing
     * @param {String} [parse_mode] - Mode for parsing entities in the GIF caption
     * @param {Array} [caption_entities] - List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param {Object} [reply_markup] - Inline keyboard attached to the message
     * @param {Object} [input_message_content] - Content of the message to be sent instead of the GIF animation
     * @returns {InlineQueryResultCachedGif} A new InlineQueryResultCachedGif object
     */
    InlineQueryResultCachedGif(params = { type, id, gif_file_id, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultCachedGif {
            constructor({ type, id, gif_file_id, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.gif_file_id = gif_file_id;
                this.title = title;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultCachedGif(params);
    }


    /**
     * @method InlineQueryResultCachedMpeg4Gif
     * @param {String} type - The type of the result
     * @param {String} id - The unique identifier for this result
     * @param {String} mpeg4_file_id - A valid file identifier for the mpeg4 file
     * @param {String} title - Optional. Title for the result
     * @param {String} caption - Optional. Caption of the mpeg4 to be sent, 0-1024 characters
     * @param {String} parse_mode - Optional. Mode for parsing entities in the mpeg4 caption
     * @param {Array} caption_entities - Optional. List of special entities that appear in the caption
     * @param {Object} reply_markup - Optional. An object for an inline keyboard
     * @param {Object} input_message_content - Optional. Content of the message to be sent instead of the mpeg4
     * @returns {InlineQueryResultCachedMpeg4Gif} A new InlineQueryResultCachedMpeg4Gif object
     */
    InlineQueryResultCachedMpeg4Gif(params = { type, id, mpeg4_file_id, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultCachedMpeg4Gif {
            constructor({ type, id, mpeg4_file_id, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.mpeg4_file_id = mpeg4_file_id;
                this.title = title;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(element => new Type().messageEntity(element)) : null;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultCachedMpeg4Gif(params);
    }

    /**
     * @method InlineQueryResultCachedPhoto
     * @param {String} type - The type of the result
     * @param {String} id - The unique identifier for this result
     * @param {String} photo_file_id - A valid file identifier for the photo file
     * @param {String} title - Optional. Title for the result
     * @param {String} description - Optional. Short description of the result
     * @param {String} caption - Optional. Caption of the photo to be sent, 0-1024 characters
     * @param {String} parse_mode - Optional. Mode for parsing entities in the photo caption
     * @param {Array} caption_entities - Optional. List of special entities that appear in the caption
     * @param {Object} reply_markup - Optional. An object for an inline keyboard
     * @param {Object} input_message_content - Optional. Content of the message to be sent instead of the photo
     * @returns {InlineQueryResultCachedPhoto} A new InlineQueryResultCachedPhoto object
     */
    InlineQueryResultCachedPhoto(params = { type, id, photo_file_id, title, description, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultCachedPhoto {
            constructor({ type, id, photo_file_id, title, description, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.photo_file_id = photo_file_id;
                this.title = title;
                this.description = description;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(element => new Type().messageEntity(element)) : null;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultCachedPhoto(params);
    }

    /**
     * @method InlineQueryResultCachedSticker
     * @param {String} type - The type of the result
     * @param {String} id - The unique identifier for this result
     * @param {String} sticker_file_id - A valid file identifier for the sticker file
     * @param {Object} reply_markup - An object for an inline keyboard
     * @param {Object} input_message_content - Content of the message to be sent instead of the sticker
     * @returns {InlineQueryResultCachedSticker} A new InlineQueryResultCachedSticker object
     */
    InlineQueryResultCachedSticker(params = { type, id, sticker_file_id, reply_markup, input_message_content }) {
        class InlineQueryResultCachedSticker {
            constructor({ type, id, sticker_file_id, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.sticker_file_id = sticker_file_id;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultCachedSticker(params);
    }


    /**
     * @method InlineQueryResultCachedVideo
     * @param {String} type - The type of the result
     * @param {String} id - The unique identifier for this result
     * @param {String} video_file_id - A valid file identifier for the video file
     * @param {String} title - Title for the result
     * @param {String} description - Short description of the result
     * @param {String} caption - Caption of the video to be sent
     * @param {String} parse_mode - Mode for parsing entities in the video caption
     * @param {Array} caption_entities - List of special entities that appear in the caption
     * @param {Object} reply_markup - An object for an inline keyboard
     * @param {Object} input_message_content - Content of the message to be sent instead of the video
     * @returns {InlineQueryResultCachedVideo} A new InlineQueryResultCachedVideo object
     */
    InlineQueryResultCachedVideo(params = { type, id, video_file_id, title, description, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultCachedVideo {
            constructor({ type, id, video_file_id, title, description, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.video_file_id = video_file_id;
                this.title = title;
                this.description = description;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultCachedVideo(params);
    }

    /**
     * @method InlineQueryResultCachedVoice
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {String} voice_file_id - A valid file identifier for the voice message
     * @param {String} title - Voice message title
     * @param {String} caption - Caption, 0-1024 characters after entities parsing
     * @param {String} parse_mode - Mode for parsing entities in the audio caption
     * @param {Array} caption_entities - List of special entities that appear in the caption
     * @param {Object} reply_markup - Inline keyboard attached to the message
     * @param {Object} input_message_content - Content of the message to be sent
     * @returns {InlineQueryResultCachedVoice} A new InlineQueryResultCachedVoice object
     */
    InlineQueryResultCachedVoice(params = { type, id, voice_file_id, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultCachedVoice {
            constructor({ type, id, voice_file_id, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.voice_file_id = voice_file_id;
                this.title = title;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultCachedVoice(params);
    }


    /**
     * @method InlineQueryResultArticle
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {String} title - Title of the result
     * @param {Object} input_message_content - Content of the message to be sent
     * @param {Object} reply_markup - Inline keyboard attached to the message
     * @param {String} url - URL of the result
     * @param {Boolean} hide_url - Pass True, if you don't want the URL to be shown in the message
     * @param {String} description - Short description of the result
     * @param {String} thumbnail_url - URL of the thumbnail for the result
     * @param {Number} thumbnail_width - Thumbnail width
     * @param {Number} thumbnail_height - Thumbnail height
     * @returns {InlineQueryResultArticle} A new InlineQueryResultArticle object
     */
    InlineQueryResultArticle(params = { type, id, title, input_message_content, reply_markup, url, hide_url, description, thumbnail_url, thumbnail_width, thumbnail_height }) {
        class InlineQueryResultArticle {
            constructor({ type, id, title, input_message_content, reply_markup, url, hide_url, description, thumbnail_url, thumbnail_width, thumbnail_height }) {
                this.type = type;
                this.id = id;
                this.title = title;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.url = url;
                this.hide_url = hide_url;
                this.description = description;
                this.thumbnail_url = thumbnail_url;
                this.thumbnail_width = thumbnail_width;
                this.thumbnail_height = thumbnail_height;
            }
        }
        return new InlineQueryResultArticle(params);
    }

    /**
     * @method InlineQueryResultAudio
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {String} audio_url - A valid URL for the audio file
     * @param {String} title - Title of the result
     * @param {String} caption - Caption of the audio file
     * @param {String} parse_mode - Mode for parsing entities in the audio caption
     * @param {Array} caption_entities - List of special entities that appear in the caption
     * @param {String} performer - Performer of the audio
     * @param {Number} audio_duration - Duration of the audio in seconds
     * @param {Object} reply_markup - An InlineKeyboardMarkup object
     * @param {Object} input_message_content - An InputMessageContent object
     * @returns {InlineQueryResultAudio} A new InlineQueryResultAudio object
     */
    InlineQueryResultAudio(params = { type, id, audio_url, title, caption, parse_mode, caption_entities, performer, audio_duration, reply_markup, input_message_content }) {
        class InlineQueryResultAudio {
            constructor({ type, id, audio_url, title, caption, parse_mode, caption_entities, performer, audio_duration, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.audio_url = audio_url;
                this.title = title;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.performer = performer;
                this.audio_duration = audio_duration;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultAudio(params);
    }

    /**
     * @method InlineQueryResultContact
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {String} phone_number - Contact's phone number
     * @param {String} first_name - Contact's first name
     * @param {String} last_name - Contact's last name
     * @param {String} vcard - Contact's vCard
     * @param {Object} reply_markup - An InlineKeyboardMarkup object
     * @param {Object} input_message_content - An InputMessageContent object
     * @param {String} thumbnail_url - URL of the thumbnail for the result
     * @param {Number} thumbnail_width - Thumbnail width
     * @param {Number} thumbnail_height - Thumbnail height
     * @returns {InlineQueryResultContact} A new InlineQueryResultContact object
     */
    InlineQueryResultContact(params = { type, id, phone_number, first_name, last_name, vcard, reply_markup, input_message_content, thumbnail_url, thumbnail_width, thumbnail_height }) {
        class InlineQueryResultContact {
            constructor({ type, id, phone_number, first_name, last_name, vcard, reply_markup, input_message_content, thumbnail_url, thumbnail_width, thumbnail_height }) {
                this.type = type;
                this.id = id;
                this.phone_number = phone_number;
                this.first_name = first_name;
                this.last_name = last_name;
                this.vcard = vcard;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
                this.thumbnail_url = thumbnail_url;
                this.thumbnail_width = thumbnail_width;
                this.thumbnail_height = thumbnail_height;
            }
        }
        return new InlineQueryResultContact(params);
    }

    /**
     * @method InlineQueryResultGame
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {String} game_short_name - Short name of the game
     * @param {Object} reply_markup - An object for an inline keyboard
     * @returns {InlineQueryResultGame} A new InlineQueryResultGame object
     */
    InlineQueryResultGame(params = { type, id, game_short_name, reply_markup }) {
        class InlineQueryResultGame {
            constructor({ type, id, game_short_name, reply_markup }) {
                this.type = type;
                this.id = id;
                this.game_short_name = game_short_name;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
            }
        }
        return new InlineQueryResultGame(params);
    }

    /**
     * @method InlineQueryResultDocument
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {String} title - Title for the result
     * @param {String} caption - Caption of the document to be sent
     * @param {String} parse_mode - Mode for parsing entities in the document caption
     * @param {Array} caption_entities - List of special entities that appear in the caption
     * @param {String} document_url - URL of the document
     * @param {String} mime_type - MIME type of the document
     * @param {String} description - Short description of the result
     * @param {Object} reply_markup - An object for an inline keyboard
     * @param {Object} input_message_content - Content of the message to be sent
     * @param {String} thumbnail_url - URL of the static thumbnail for the result
     * @param {Number} thumbnail_width - Width of the thumbnail
     * @param {Number} thumbnail_height - Height of the thumbnail
     * @returns {InlineQueryResultDocument} A new InlineQueryResultDocument object
     */
    InlineQueryResultDocument(params = { type, id, title, caption, parse_mode, caption_entities, document_url, mime_type, description, reply_markup, input_message_content, thumbnail_url, thumbnail_width, thumbnail_height }) {
        class InlineQueryResultDocument {
            constructor({ type, id, title, caption, parse_mode, caption_entities, document_url, mime_type, description, reply_markup, input_message_content, thumbnail_url, thumbnail_width, thumbnail_height }) {
                this.type = type;
                this.id = id;
                this.title = title;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(element => new Type().messageEntity(element)) : [];
                this.document_url = document_url;
                this.mime_type = mime_type;
                this.description = description;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
                this.thumbnail_url = thumbnail_url;
                this.thumbnail_width = thumbnail_width;
                this.thumbnail_height = thumbnail_height;
            }
        }
        return new InlineQueryResultDocument(params);
    }

    /**
     * @method InlineQueryResultGif
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {String} gif_url - URL of the GIF file
     * @param {Number} gif_width - Width of the GIF
     * @param {Number} gif_height - Height of the GIF
     * @param {Number} gif_duration - Duration of the GIF
     * @param {String} thumbnail_url - URL of the static thumbnail for the result
     * @param {String} thumbnail_mime_type - MIME type of the thumbnail
     * @param {String} title - Title for the result
     * @param {String} caption - Caption of the GIF file to be sent
     * @param {String} parse_mode - Mode for parsing entities in the GIF caption
     * @param {Array} caption_entities - List of special entities that appear in the caption
     * @param {Object} reply_markup - An object for an inline keyboard
     * @param {Object} input_message_content - Content of the message to be sent
     * @returns {InlineQueryResultGif} A new InlineQueryResultGif object
     */
    InlineQueryResultGif(params = { type, id, gif_url, gif_width, gif_height, gif_duration, thumbnail_url, thumbnail_mime_type, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultGif {
            constructor({ type, id, gif_url, gif_width, gif_height, gif_duration, thumbnail_url, thumbnail_mime_type, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.gif_url = gif_url;
                this.gif_width = gif_width;
                this.gif_height = gif_height;
                this.gif_duration = gif_duration;
                this.thumbnail_url = thumbnail_url;
                this.thumbnail_mime_type = thumbnail_mime_type;
                this.title = title;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(element => new Type().messageEntity(element)) : [];
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultGif(params);
    }


    /**
     * @method InlineQueryResultLocation
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {Number} latitude - Location latitude
     * @param {Number} longitude - Location longitude
     * @param {String} title - Location title
     * @param {Number} horizontal_accuracy - The horizontal accuracy of the location in meters
     * @param {Number} live_period - Period in seconds for which the location can be updated
     * @param {Number} heading - For live locations, a direction in which the user is moving
     * @param {Number} proximity_alert_radius - For live locations, a maximum distance for proximity alerts about approaching another chat member
     * @param {Object} reply_markup - An object for an inline keyboard
     * @param {Object} input_message_content - Content of the message to be sent
     * @param {String} thumbnail_url - URL of the thumbnail for the result
     * @param {Number} thumbnail_width - Thumbnail width
     * @param {Number} thumbnail_height - Thumbnail height
     * @returns {InlineQueryResultLocation} A new InlineQueryResultLocation object
     */
    InlineQueryResultLocation(params = { type, id, latitude, longitude, title, horizontal_accuracy, live_period, heading, proximity_alert_radius, reply_markup, input_message_content, thumbnail_url, thumbnail_width, thumbnail_height }) {
        class InlineQueryResultLocation {
            constructor({ type, id, latitude, longitude, title, horizontal_accuracy, live_period, heading, proximity_alert_radius, reply_markup, input_message_content, thumbnail_url, thumbnail_width, thumbnail_height }) {
                this.type = type;
                this.id = id;
                this.latitude = latitude;
                this.longitude = longitude;
                this.title = title;
                this.horizontal_accuracy = horizontal_accuracy;
                this.live_period = live_period;
                this.heading = heading;
                this.proximity_alert_radius = proximity_alert_radius;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
                this.thumbnail_url = thumbnail_url;
                this.thumbnail_width = thumbnail_width;
                this.thumbnail_height = thumbnail_height;
            }
        }
        return new InlineQueryResultLocation(params);
    }

    /**
     * @method InlineQueryResultMpeg4Gif
     * @param {String} type - The type of the result
     * @param {String} id - The ID of the result
     * @param {String} mpeg4_url - The URL of the Mpeg4 file
     * @param {Number} mpeg4_width - The width of the Mpeg4
     * @param {Number} mpeg4_height - The height of the Mpeg4
     * @param {Number} mpeg4_duration - The duration of the Mpeg4
     * @param {String} thumbnail_url - The URL of the thumbnail
     * @param {String} thumbnail_mime_type - The MIME type of the thumbnail
     * @param {String} title - The title of the result
     * @param {String} caption - The caption of the result
     * @param {String} parse_mode - The parse mode of the caption
     * @param {Array} caption_entities - The entities of the caption
     * @param {Object} reply_markup - The reply markup
     * @param {Object} input_message_content - The content of the message
     * @returns {InlineQueryResultMpeg4Gif} A new InlineQueryResultMpeg4Gif object
     */
    InlineQueryResultMpeg4Gif(params = { type, id, mpeg4_url, mpeg4_width, mpeg4_height, mpeg4_duration, thumbnail_url, thumbnail_mime_type, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultMpeg4Gif {
            constructor({ type, id, mpeg4_url, mpeg4_width, mpeg4_height, mpeg4_duration, thumbnail_url, thumbnail_mime_type, title, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.mpeg4_url = mpeg4_url;
                this.mpeg4_width = mpeg4_width;
                this.mpeg4_height = mpeg4_height;
                this.mpeg4_duration = mpeg4_duration;
                this.thumbnail_url = thumbnail_url;
                this.thumbnail_mime_type = thumbnail_mime_type;
                this.title = title;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultMpeg4Gif(params);
    }

    /**
     * @method InlineQueryResultPhoto
     * @param {String} type - The type of the result
     * @param {String} id - The ID of the result
     * @param {String} photo_url - The URL of the photo
     * @param {String} thumbnail_url - The URL of the thumbnail for the photo
     * @param {Number} photo_width - The width of the photo
     * @param {Number} photo_height - The height of the photo
     * @param {String} title - The title of the result
     * @param {String} description - The description of the result
     * @param {String} caption - The caption of the photo
     * @param {String} parse_mode - The parse mode of the caption
     * @param {Array} caption_entities - The entities of the caption
     * @param {Object} reply_markup - The reply markup
     * @param {Object} input_message_content - The content of the message
     * @returns {InlineQueryResultPhoto} A new InlineQueryResultPhoto object
     */
    InlineQueryResultPhoto(params = { type, id, photo_url, thumbnail_url, photo_width, photo_height, title, description, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
        class InlineQueryResultPhoto {
            constructor({ type, id, photo_url, thumbnail_url, photo_width, photo_height, title, description, caption, parse_mode, caption_entities, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.photo_url = photo_url;
                this.thumbnail_url = thumbnail_url;
                this.photo_width = photo_width;
                this.photo_height = photo_height;
                this.title = title;
                this.description = description;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultPhoto(params);
    }

    /**
     * @method InlineQueryResultVenue
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {Number} latitude - Latitude of the venue location
     * @param {Number} longitude - Longitude of the venue location
     * @param {String} title - Title of the venue
     * @param {String} address - Address of the venue
     * @param {String} foursquare_id - Optional. Foursquare identifier of the venue
     * @param {String} foursquare_type - Optional. Foursquare type of the venue
     * @param {String} google_place_id - Optional. Google Places identifier of the venue
     * @param {String} google_place_type - Optional. Google Places type of the venue
     * @param {Object} reply_markup - Optional. Inline keyboard attached to the message
     * @param {Object} input_message_content - Optional. Content of the message to be sent
     * @param {String} thumbnail_url - Optional. URL of the thumbnail (jpeg only) for the result
     * @param {Number} thumbnail_width - Optional. Thumbnail width
     * @param {Number} thumbnail_height - Optional. Thumbnail height
     * @returns {InlineQueryResultVenue} A new InlineQueryResultVenue object
     */
    InlineQueryResultVenue(params = { type, id, latitude, longitude, title, address, foursquare_id, foursquare_type, google_place_id, google_place_type, reply_markup, input_message_content, thumbnail_url, thumbnail_width, thumbnail_height }) {
        class InlineQueryResultVenue {
            constructor({ type, id, latitude, longitude, title, address, foursquare_id, foursquare_type, google_place_id, google_place_type, reply_markup, input_message_content, thumbnail_url, thumbnail_width, thumbnail_height }) {
                this.type = type;
                this.id = id;
                this.latitude = latitude;
                this.longitude = longitude;
                this.title = title;
                this.address = address;
                this.foursquare_id = foursquare_id;
                this.foursquare_type = foursquare_type;
                this.google_place_id = google_place_id;
                this.google_place_type = google_place_type;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
                this.thumbnail_url = thumbnail_url;
                this.thumbnail_width = thumbnail_width;
                this.thumbnail_height = thumbnail_height;
            }
        }
        return new InlineQueryResultVenue(params);
    }

    /**
     * @method InlineQueryResultVideo
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {String} video_url - A valid URL for the embedded video player or video file
     * @param {String} mime_type - Mime type of the content of video url
     * @param {String} thumbnail_url - URL of the static thumbnail (jpeg or gif) for the result
     * @param {String} title - Title for the result
     * @param {String} caption - Optional. Caption of the video to be sent
     * @param {String} parse_mode - Optional. Mode for parsing entities in the video caption
     * @param {Array} caption_entities - Optional. List of special entities that appear in the caption
     * @param {Number} video_width - Optional. Video width
     * @param {Number} video_height - Optional. Video height
     * @param {Number} video_duration - Optional. Video duration in seconds
     * @param {String} description - Optional. Short description of the result
     * @param {Object} reply_markup - Optional. Inline keyboard attached to the message
     * @param {Object} input_message_content - Optional. Content of the message to be sent
     * @returns {InlineQueryResultVideo} A new InlineQueryResultVideo object
     */
    InlineQueryResultVideo(params = { type, id, video_url, mime_type, thumbnail_url, title, caption, parse_mode, caption_entities, video_width, video_height, video_duration, description, reply_markup, input_message_content }) {
        class InlineQueryResultVideo {
            constructor({ type, id, video_url, mime_type, thumbnail_url, title, caption, parse_mode, caption_entities, video_width, video_height, video_duration, description, reply_markup, input_message_content }) {
                this.type = type;
                this.id = id;
                this.video_url = video_url;
                this.mime_type = mime_type;
                this.thumbnail_url = thumbnail_url;
                this.title = title;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities ? caption_entities.map(entity => new Type().messageEntity(entity)) : null;
                this.video_width = video_width;
                this.video_height = video_height;
                this.video_duration = video_duration;
                this.description = description;
                this.reply_markup = reply_markup ? new Type().InlineKeyboardMarkup(reply_markup) : null;
                this.input_message_content = input_message_content ? new Type().InputMessageContent(input_message_content) : null;
            }
        }
        return new InlineQueryResultVideo(params);
    }

    /**
     * @method InlineQueryResultVoice
     * @param {String} type - Type of the result
     * @param {String} id - Unique identifier for this result
     * @param {String} voice_url - A valid URL for the voice recording
     * @param {String} title - Recording title
     * @param {String} caption - Optional. Caption for the recording
     * @param {String} parse_mode - Optional. Mode for parsing entities in the recording caption
     * @param {Array} caption_entities - Optional. List of special entities that appear in the caption
     * @param {Number} voice_duration - Optional. Duration of the voice recording
     * @param {Object} reply_markup - Optional. An InlineKeyboardMarkup object
     * @param {Object} input_message_content - Optional. An InputMessageContent object
     * @returns {InlineQueryResultVoice} A new InlineQueryResultVoice object
     */
    InlineQueryResultVoice(params = { type, id, voice_url, title, caption, parse_mode, caption_entities, voice_duration, reply_markup, input_message_content }) {
        class InlineQueryResultVoice {
            constructor(type, id, voice_url, title, caption, parse_mode, caption_entities, voice_duration, reply_markup, input_message_content) {
                this.type = type;
                this.id = id;
                this.voice_url = voice_url;
                this.title = title;
                this.caption = caption;
                this.parse_mode = parse_mode;
                this.caption_entities = caption_entities.map(element => new Type().messageEntity(element));
                this.voice_duration = voice_duration;
                this.reply_markup = new Type().InlineKeyboardMarkup(reply_markup);
                this.input_message_content = new Type().InputMessageContent(input_message_content);
            }
        }
        return new InlineQueryResultVoice(type, id, voice_url, title, caption, parse_mode, caption_entities, voice_duration, reply_markup, input_message_content);
    }

    InputMessageContent(params = {}) {
        if (params.message_text) {
            return new Type().InputMessageContent(params);
        }
        if (params.address) {
            return new Type().InputVenueMessageContent(params);
        }
        if (params.phone_number) {
            return new Type().InputContactMessageContent(params);
        }
        if (params.payload) {
            return new Type().InputInvoiceMessageContent(params);
        }
        if (!params.address) {
            return new Type().InputLocationMessageContent(params);
        }
    }

    /**
     * @method InputTextMessageContent
     * @param {String} message_text - Text of the message to be sent
     * @param {String} parse_mode - Mode for parsing entities in the message text
     * @param {Array} entities - List of special entities that appear in message text
     * @param {Boolean} disable_web_page_preview - Disables link previews for links in the sent message
     * @returns {InputTextMessageContent} A new InputTextMessageContent object
     */
    InputTextMessageContent(params = { message_text, parse_mode, entities, disable_web_page_preview }) {
        class InputTextMessageContent {
            constructor(message_text, parse_mode, entities, disable_web_page_preview) {
                this.message_text = message_text;
                this.parse_mode = parse_mode;
                this.entities = entities.map(element => new Type().messageEntity(element));
                this.disable_web_page_preview = disable_web_page_preview;
            }
        }
        return new InputTextMessageContent(message_text, parse_mode, entities, disable_web_page_preview);
    }

    /**
     * @method InputLocationMessageContent
     * @param {Number} latitude - The latitude of the location
     * @param {Number} longitude - The longitude of the location
     * @param {Number} horizontal_accuracy - The radius of uncertainty for the location
     * @param {Number} live_period - The period in seconds for which the location will be updated
     * @param {Number} heading - The direction in which the user is moving
     * @param {Number} proximity_alert_radius - The maximum distance for proximity alerts
     * @returns {InputLocationMessageContent} A new InputLocationMessageContent object
     */
    InputLocationMessageContent(params = { latitude, longitude, horizontal_accuracy, live_period, heading, proximity_alert_radius }) {
        class InputLocationMessageContent {
            constructor(latitude, longitude, horizontal_accuracy, live_period, heading, proximity_alert_radius) {
                this.latitude = latitude;
                this.longitude = longitude;
                this.horizontal_accuracy = horizontal_accuracy;
                this.live_period = live_period;
                this.heading = heading;
                this.proximity_alert_radius = proximity_alert_radius;
            }
        }
        return new InputLocationMessageContent(latitude, longitude, horizontal_accuracy, live_period, heading, proximity_alert_radius);
    }

    /**
     * @method InputVenueMessageContent
     * @param {Number} latitude - The latitude of the venue
     * @param {Number} longitude - The longitude of the venue
     * @param {String} title - The title of the venue
     * @param {String} address - The address of the venue
     * @param {String} foursquare_id - The Foursquare identifier of the venue
     * @param {String} foursquare_type - The Foursquare type of the venue
     * @param {String} google_place_id - The Google Places identifier of the venue
     * @param {String} google_place_type - The Google Places type of the venue
     * @returns {InputVenueMessageContent} A new InputVenueMessageContent object
     */
    InputVenueMessageContent(params = { latitude, longitude, title, address, foursquare_id, foursquare_type, google_place_id, google_place_type }) {
        class InputVenueMessageContent {
            constructor(latitude, longitude, title, address, foursquare_id, foursquare_type, google_place_id, google_place_type) {
                this.latitude = latitude;
                this.longitude = longitude;
                this.title = title;
                this.address = address;
                this.foursquare_id = foursquare_id;
                this.foursquare_type = foursquare_type;
                this.google_place_id = google_place_id;
                this.google_place_type = google_place_type;
            }
        }
        return new InputVenueMessageContent(latitude, longitude, title, address, foursquare_id, foursquare_type, google_place_id, google_place_type);
    }

    /**
     * @method InputContactMessageContent
     * @param {String} phone_number - The phone number of the contact
     * @param {String} first_name - The first name of the contact
     * @param {String} last_name - The last name of the contact
     * @param {String} vcard - The vCard of the contact
     * @returns {InputContactMessageContent} A new InputContactMessageContent object
     */
    InputContactMessageContent(params = { phone_number, first_name, last_name, vcard }) {
        class InputContactMessageContent {
            constructor(phone_number, first_name, last_name, vcard) {
                this.phone_number = phone_number;
                this.first_name = first_name;
                this.last_name = last_name;
                this.vcard = vcard;
            }
        }
        return new InputContactMessageContent(phone_number, first_name, last_name, vcard);
    }

    /**
     * @method InputInvoiceMessageContent
     * @param {String} title - Product name
     * @param {String} description - Product description
     * @param {String} payload - Bot-defined invoice payload
     * @param {String} provider_token - Payments provider token
     * @param {String} currency - Three-letter ISO 4217 currency code
     * @param {Array} prices - Price breakdown, a list of components
     * @param {Number} max_tip_amount - Maximum accepted amount for tips in the smallest units of the currency
     * @param {Array} suggested_tip_amounts - Suggested tip amounts
     * @param {String} provider_data - JSON-encoded data about the invoice
     * @param {String} photo_url - URL of the product photo for the invoice
     * @param {Number} photo_size - Photo size
     * @param {Number} photo_width - Photo width
     * @param {Number} photo_height - Photo height
     * @param {Boolean} need_name - Pass True, if you require the user's full name
     * @param {Boolean} need_phone_number - Pass True, if you require the user's phone number
     * @param {Boolean} need_email - Pass True, if you require the user's email
     * @param {Boolean} need_shipping_address - Pass True, if you require the user's shipping address
     * @param {Boolean} send_phone_number_to_provider - Pass True, if user's phone number should be sent to provider
     * @param {Boolean} send_email_to_provider - Pass True, if user's email address should be sent to provider
     * @param {Boolean} is_flexible - Pass True, if the final price depends on the shipping method
     * @returns {InputInvoiceMessageContent} A new InputInvoiceMessageContent object
     */
    InputInvoiceMessageContent(params = { title, description, payload, provider_token, currency, prices, max_tip_amount, suggested_tip_amounts, provider_data, photo_url, photo_size, photo_width, photo_height, need_name, need_phone_number, need_email, need_shipping_address, send_phone_number_to_provider, send_email_to_provider, is_flexible }) {
        class InputInvoiceMessageContent {
            constructor(title, description, payload, provider_token, currency, prices, max_tip_amount, suggested_tip_amounts, provider_data, photo_url, photo_size, photo_width, photo_height, need_name, need_phone_number, need_email, need_shipping_address, send_phone_number_to_provider, send_email_to_provider, is_flexible) {
                this.title = title;
                this.description = description;
                this.payload = payload;
                this.provider_token = provider_token;
                this.currency = currency;
                this.prices = prices ? prices.map(price => new Type().LabeledPrice(price)) : null;
                this.max_tip_amount = max_tip_amount;
                this.suggested_tip_amounts = suggested_tip_amounts;
                this.provider_data = provider_data;
                this.photo_url = photo_url;
                this.photo_size = photo_size;
                this.photo_width = photo_width;
                this.photo_height = photo_height;
                this.need_name = need_name;
                this.need_phone_number = need_phone_number;
                this.need_email = need_email;
                this.need_shipping_address = need_shipping_address;
                this.send_phone_number_to_provider = send_phone_number_to_provider;
                this.send_email_to_provider = send_email_to_provider;
                this.is_flexible = is_flexible;
            }
        }
        return new InputInvoiceMessageContent(title, description, payload, provider_token, currency, prices, max_tip_amount, suggested_tip_amounts, provider_data, photo_url, photo_size, photo_width, photo_height, need_name, need_phone_number, need_email, need_shipping_address, send_phone_number_to_provider, send_email_to_provider, is_flexible);
    }

    /**
     * @method ChosenInlineResult
     * @param {String} result_id - The unique identifier for the result that was chosen
     * @param {Object} from - The user that chose the result
     * @param {Object} location - Optional. Sender location, only for bots that require user location
     * @param {String} inline_message_id - Optional. Identifier of the sent inline message
     * @param {String} query - The query that was used to obtain the result
     * @returns {ChosenInlineResult} A new ChosenInlineResult object
     */
    ChosenInlineResult(params = { result_id, from, location, inline_message_id, query }) {
        class ChosenInlineResult {
            constructor({ result_id, from, location, inline_message_id, query }) {
                this.result_id = result_id;
                this.from = from ? new Type().user(from) : null;
                this.location = location ? new Type().Location(location) : null;
                this.inline_message_id = inline_message_id;
                this.query = query;
            }
        }
        return new ChosenInlineResult(params);
    }

    /**
     * @method SentWebAppMessage
     * @param {String} inline_message_id - Identifier of the sent inline message
     * @returns {SentWebAppMessage} A new SentWebAppMessage object
     */
    SentWebAppMessage(params = { inline_message_id }) {
        class SentWebAppMessage {
            constructor({ inline_message_id }) {
                this.inline_message_id = inline_message_id;
            }
        }
        return new SentWebAppMessage(params);
    }

    // Payments

    /**
     * @method LabeledPrice
     * @param {String} label - Portion label
     * @param {Integer} amount - Price of the product in the smallest units of the currency
     * @returns {LabeledPrice} A new LabeledPrice object
     */
    LabeledPrice(params = { label, amount }) {
        class LabeledPrice {
            constructor({ label, amount }) {
                this.label = label;
                this.amount = amount;
            }
        }
        return new LabeledPrice(params);
    }

    /**
     * @method Invoice
     * @param {String} title - Product name
     * @param {String} description - Product description
     * @param {String} start_parameter - Unique bot deep-linking parameter that can be used to generate this invoice
     * @param {String} currency - Three-letter ISO 4217 currency code
     * @param {Integer} total_amount - Total price in the smallest units of the currency
     * @returns {Invoice} A new Invoice object
     */
    Invoice(params = { title, description, start_parameter, currency, total_amount }) {
        class Invoice {
            constructor({ title, description, start_parameter, currency, total_amount }) {
                this.title = title;
                this.description = description;
                this.start_parameter = start_parameter;
                this.currency = currency;
                this.total_amount = total_amount;
            }
        }
        return new Invoice(params);
    }

    /**
     * @method ShippingAddress
     * @param {String} country_code - ISO 3166-1 alpha-2 country code
     * @param {String} state - State
     * @param {String} city - City
     * @param {String} street_line1 - First part of the address
     * @param {String} street_line2 - Second part of the address
     * @param {String} post_code - Post code
     * @returns {ShippingAddress} A new ShippingAddress object
     */
    ShippingAddress(params = { country_code, state, city, street_line1, street_line2, post_code }) {
        class ShippingAddress {
            constructor({ country_code, state, city, street_line1, street_line2, post_code }) {
                this.country_code = country_code;
                this.state = state;
                this.city = city;
                this.street_line1 = street_line1;
                this.street_line2 = street_line2;
                this.post_code = post_code;
            }
        }
        return new ShippingAddress(params);
    }

    /**
     * @method OrderInfo
     * @param {String} name - User name
     * @param {String} phone_number - User's phone number
     * @param {String} email - User email
     * @param {Object} shipping_address - User shipping address
     * @returns {OrderInfo} A new OrderInfo object
     */
    OrderInfo(params = { name, phone_number, email, shipping_address }) {
        class OrderInfo {
            constructor({ name, phone_number, email, shipping_address }) {
                this.name = name;
                this.phone_number = phone_number;
                this.email = email;
                this.shipping_address = shipping_address ? new Type().ShippingAddress(shipping_address) : null;
            }
        }
        return new OrderInfo(params);
    }

    /**
     * @method ShippingOption
     * @param {String} id - Shipping option identifier
     * @param {String} title - Option title
     * @param {Array} prices - List of price portions
     * @returns {ShippingOption} A new ShippingOption object
     */
    ShippingOption(params = { id, title, prices }) {
        class ShippingOption {
            constructor({ id, title, prices }) {
                this.id = id;
                this.title = title;
                this.prices = prices ? prices.map(price => new Type().LabeledPrice(price)) : [];
            }
        }
        return new ShippingOption(params);
    }

    /**
     * @method SuccessfulPayment
     * @param {String} currency - Three-letter ISO 4217 currency code
     * @param {Number} total_amount - Total price in the smallest units of the currency
     * @param {String} invoice_payload - Bot specified invoice payload
     * @param {String} [shipping_option_id] - Identifier of the shipping option chosen by the user
     * @param {Object} [order_info] - Order info provided by the user
     * @param {String} telegram_payment_charge_id - Telegram payment identifier
     * @param {String} provider_payment_charge_id - Provider payment identifier
     * @returns {SuccessfulPayment} A new SuccessfulPayment object
     */
    SuccessfulPayment(params = { currency, total_amount, invoice_payload, shipping_option_id, order_info, telegram_payment_charge_id, provider_payment_charge_id }) {
        class SuccessfulPayment {
            constructor({ currency, total_amount, invoice_payload, shipping_option_id, order_info, telegram_payment_charge_id, provider_payment_charge_id }) {
                this.currency = currency;
                this.total_amount = total_amount;
                this.invoice_payload = invoice_payload;
                this.shipping_option_id = shipping_option_id;
                this.order_info = order_info ? new Type().OrderInfo(order_info) : null;
                this.telegram_payment_charge_id = telegram_payment_charge_id;
                this.provider_payment_charge_id = provider_payment_charge_id;
            }
        }
        return new SuccessfulPayment(params);
    }

    /**
     * @method ShippingQuery
     * @param {String} id - Unique query identifier
     * @param {Object} from - User who sent the query
     * @param {String} invoice_payload - Bot specified invoice payload
     * @param {Object} shipping_address - User specified shipping address
     * @returns {ShippingQuery} A new ShippingQuery object
     */
    ShippingQuery(params = { id, from, invoice_payload, shipping_address }) {
        class ShippingQuery {
            constructor({ id, from, invoice_payload, shipping_address }) {
                this.id = id;
                this.from = from ? new Type().user(from) : null;
                this.invoice_payload = invoice_payload;
                this.shipping_address = new Type().ShippingAddress(shipping_address);
            }
        }
        return new ShippingQuery(params);
    }

    /**
     * @method PreCheckoutQuery
     * @param {String} id - Unique query identifier
     * @param {Object} from - User who sent the query
     * @param {String} currency - Three-letter ISO 4217 currency code
     * @param {Number} total_amount - Total price in the smallest units of the currency
     * @param {String} invoice_payload - Bot specified invoice payload
     * @param {String} [shipping_option_id] - Identifier of the shipping option chosen by the user
     * @param {Object} [order_info] - Order info provided by the user
     * @returns {PreCheckoutQuery} A new PreCheckoutQuery object
     */
    PreCheckoutQuery(params = { id, from, currency, total_amount, invoice_payload, shipping_option_id, order_info }) {
        class PreCheckoutQuery {
            constructor({ id, from, currency, total_amount, invoice_payload, shipping_option_id, order_info }) {
                this.id = id;
                this.from = from ? new Type().user(from) : null;
                this.currency = currency;
                this.total_amount = total_amount;
                this.invoice_payload = invoice_payload;
                this.shipping_option_id = shipping_option_id;
                this.order_info = order_info ? new Type().OrderInfo(order_info) : null;
            }
        }
        return new PreCheckoutQuery(params);
    }

    // Telegram Passport

    /**
     * @method PassportData
     * @param {Array} data - An array of EncryptedPassportElement objects
     * @param {Object} credentials - EncryptedCredentials object
     * @returns {PassportData} A new PassportData object
     */
    PassportData(params = { data, credentials }) {
        class PassportData {
            constructor({ data, credentials }) {
                this.data = data ? data.map(element => new Type().EncryptedPassportElement(element)) : null;
                this.credentials = credentials ? new Type().EncryptedCredentials(credentials) : null;
            }
        }
        return new PassportData(params);
    }

    /**
    * @method PassportFile
    * @param {String} file_id - Unique identifier for this file, which is supposed to be the same over time and for different bots
    * @param {String} file_unique_id - Unique identifier for this file
    * @param {Number} file_size - File size
    * @param {Number} file_date - Unix time when the file was uploaded
    * @returns {PassportFile} A new PassportFile object
    */
    PassportFile(params = { file_id, file_unique_id, file_size, file_date }) {
        class PassportFile {
            constructor({ file_id, file_unique_id, file_size, file_date }) {
                this.file_id = file_id;
                this.file_unique_id = file_unique_id;
                this.file_size = file_size;
                this.file_date = file_date;
            }
        }
        return new PassportFile(params);
    }

    /**
     * @method EncryptedPassportElement
     * @param {String} type - The type of the element
     * @param {String} data - The data of the element
     * @param {String} phone_number - The phone number of the element
     * @param {String} email - The email of the element
     * @param {Array} files - An array of PassportFile objects
     * @param {Object} front_side - A PassportFile object
     * @param {Object} reverse_side - A PassportFile object
     * @param {Object} selfie - A PassportFile object
     * @param {Array} translation - An array of PassportFile objects
     * @param {String} hash - The hash of the element
     * @returns {EncryptedPassportElement} A new EncryptedPassportElement object
     */
    EncryptedPassportElement(params = { type, data, phone_number, email, files, front_side, reverse_side, selfie, translation, hash }) {
        class EncryptedPassportElement {
            constructor({ type, data, phone_number, email, files, front_side, reverse_side, selfie, translation, hash }) {
                this.type = type;
                this.data = data;
                this.phone_number = phone_number;
                this.email = email;
                this.files = files ? files.map(file => new Type().PassportFile(file)) : null;
                this.front_side = front_side ? new Type().PassportFile(front_side) : null;
                this.reverse_side = reverse_side ? new Type().PassportFile(reverse_side) : null;
                this.selfie = selfie ? new Type().PassportFile(selfie) : null;
                this.translation = translation ? translation.map(file => new Type().PassportFile(file)) : null;
                this.hash = hash;
            }
        }
        return new EncryptedPassportElement(params);
    }

    /**
     * @method EncryptedCredentials
     * @param {String} data - Encrypted JSON-serialized data with unique user's payload, data hashes and secrets required for EncryptedCredentials decryption and user identity verification
     * @param {String} hash - Data hash for data authentication
     * @param {String} secret - Secret, encrypted with the bot's public RSA key, required for data decryption
     * @returns {EncryptedCredentials} A new EncryptedCredentials object
     */
    EncryptedCredentials(params = { data, hash, secret }) {
        class EncryptedCredentials {
            constructor({ data, hash, secret }) {
                this.data = data;
                this.hash = hash;
                this.secret = secret;
            }
        }
        return new EncryptedCredentials(params);
    }

    PassportElementError(params = {}) {
        switch (params.source) {
            case 'data':
                return new Type().PassportElementErrorDataField(params);
            case 'front_side':
                return new Type().PassportElementErrorFrontSide(params);
            case 'reverse_side':
                return new Type().PassportElementErrorReverseSide(params);
            case 'selfie':
                return new Type().PassportElementErrorSelfie(params);
            case 'file':
                return new Type().PassportElementErrorFile(params);
            case 'files':
                return new Type().PassportElementErrorFiles(params);
            case 'translation_file':
                return new Type().PassportElementErrorTranslationFile(params);
            case 'translation_files':
                return new Type().PassportElementErrorTranslationFiles(params);
            case 'unspecified':
                return new Type().PassportElementErrorUnspecified(params);
        }
    }

    /**
     * @method PassportElementErrorDataField
     * @param {String} source - Error source, must be data
     * @param {String} field_name - Name of the data field which has the issue
     * @param {String} data_hash - Base64-encoded data hash
     * @param {String} message - Error message
     * @returns {PassportElementErrorDataField} A new PassportElementErrorDataField object
     */
    PassportElementErrorDataField(params = { source, field_name, data_hash, message }) {
        class PassportElementErrorDataField {
            constructor({ source, field_name, data_hash, message }) {
                this.source = source;
                this.field_name = field_name;
                this.data_hash = data_hash;
                this.message = message;
            }
        }
        return new PassportElementErrorDataField(params);
    }


    /**
     * @method PassportElementErrorFrontSide
     * @param {String} source - Error source, must be front_side
     * @param {String} type - The section of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”
     * @param {String} file_hash - Base64-encoded file hash
     * @param {String} message - Error message
     * @returns {PassportElementErrorFrontSide} A new PassportElementErrorFrontSide object
     */
    PassportElementErrorFrontSide(params = { source, type, file_hash, message }) {
        class PassportElementErrorFrontSide {
            constructor({ source, type, file_hash, message }) {
                this.source = source;
                this.type = type;
                this.file_hash = file_hash;
                this.message = message;
            }
        }
        return new PassportElementErrorFrontSide(params);
    }

    /**
     * @method PassportElementErrorReverseSide
     * @param {String} source - Error source, must be reverse_side
     * @param {String} type - The section of the user's Telegram Passport which has the issue, one of “driver_license”, “identity_card”
     * @param {String} file_hash - Base64-encoded file hash
     * @param {String} message - Error message
     * @returns {PassportElementErrorReverseSide} A new PassportElementErrorReverseSide object
     */
    PassportElementErrorReverseSide(params = { source, type, file_hash, message }) {
        class PassportElementErrorReverseSide {
            constructor({ source, type, file_hash, message }) {
                this.source = source;
                this.type = type;
                this.file_hash = file_hash;
                this.message = message;
            }
        }
        return new PassportElementErrorReverseSide(params);
    }

    /**
     * @method PassportElementErrorSelfie
     * @param {String} source - Error source, must be selfie
     * @param {String} type - The section of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”
     * @param {String} file_hash - Base64-encoded file hash
     * @param {String} message - Error message
     * @returns {PassportElementErrorSelfie} A new PassportElementErrorSelfie object
     */
    PassportElementErrorSelfie(params = { source, type, file_hash, message }) {
        class PassportElementErrorSelfie {
            constructor({ source, type, file_hash, message }) {
                this.source = source;
                this.type = type;
                this.file_hash = file_hash;
                this.message = message;
            }
        }
        return new PassportElementErrorSelfie(params);
    }

    /**
     * @method PassportElementErrorFile
     * @param {String} source - Error source, must be file
     * @param {String} type - The section of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”, “phone”, “email”
     * @param {String} file_hash - Base64-encoded file hash
     * @param {String} message - Error message
     * @returns {PassportElementErrorFile} A new PassportElementErrorFile object
     */
    PassportElementErrorFile(params = { source, type, file_hash, message }) {
        class PassportElementErrorFile {
            constructor({ source, type, file_hash, message }) {
                this.source = source;
                this.type = type;
                this.file_hash = file_hash;
                this.message = message;
            }
        }
        return new PassportElementErrorFile(params);
    }


    PassportElementErrorFiles(params = { source, type, file_hashes, message }) {
        class PassportElementErrorFiles {
            constructor({ source, type, file_hashes, message }) {
                this.source = source;
                this.type = type;
                this.file_hashes = file_hashes;
                this.message = message;
            }
        }
        return new PassportElementErrorFiles(params);
    }

    /**
     * @method PassportElementErrorTranslationFile
     * @param {String} source - Error source, must be translation_files
     * @param {String} type - Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
     * @param {String} file_hash - Base64-encoded file hash
     * @param {String} message - Error message
     * @returns {PassportElementErrorTranslationFile}
     */
    PassportElementErrorTranslationFile(params = { source, type, file_hash, message }) {
        class PassportElementErrorTranslationFile {
            constructor({ source, type, file_hash, message }) {
                this.source = source;
                this.type = type;
                this.file_hash = file_hash;
                this.message = message;
            }
        }
        return new PassportElementErrorTranslationFile(params);
    }

    /**
     * @method PassportElementErrorTranslationFiles
     * @param {String} source - Error source, must be translation_files
     * @param {String} type - Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”
     * @param {Array} file_hashes - List of base64-encoded file hashes
     * @param {String} message - Error message
     * @returns {PassportElementErrorTranslationFiles}
     */
    PassportElementErrorTranslationFiles(params = { source, type, file_hashes, message }) {
        class PassportElementErrorTranslationFiles {
            constructor({ source, type, file_hashes, message }) {
                this.source = source;
                this.type = type;
                this.file_hashes = file_hashes;
                this.message = message;
            }
        }
        return new PassportElementErrorTranslationFiles(params);
    }

    /**
     * @method PassportElementErrorUnspecified
     * @param {String} source - Error source, must be unspecified
     * @param {String} type - Type of element of the user's Telegram Passport which has the issue
     * @param {String} element_hash - Base64-encoded element hash
     * @param {String} message - Error message
     * @returns {PassportElementErrorUnspecified}
     */
    PassportElementErrorUnspecified(params = { source, type, element_hash, message }) {
        class PassportElementErrorUnspecified {
            constructor({ source, type, element_hash, message }) {
                this.source = source;
                this.type = type;
                this.element_hash = element_hash;
                this.message = message;
            }
        }
        return new PassportElementErrorUnspecified(params);
    }

    // Games

    /**
     * @method Game
     * @param {string} title - The title of the game.
     * @param {string} description - The description of the game.
     * @param {Object[]} photo - An array of photo objects.
     * @param {string} text - The text of the game.
     * @param {Object[]} text_entities - An array of message entity objects.
     * @param {Object} animation - An animation object.
     * @returns {Game} A new Game object.
     */
    Game(params = { title, description, photo, text, text_entities, animation }) {
        class Game {
            constructor({ title, description, photo, text, text_entities, animation }) {
                this.title = title;
                this.description = description;
                this.photo = photo ? photo.map(element => {
                    return new Type().PhotoSize(element)
                }) : null;
                this.text = text;
                this.text_entities = text_entities ? text_entities.map(element => {
                    return new Type().messageEntity(element)
                }) : null;
                this.animation = animation ? new Type().Animation(animation) : null;
            }
        }
        return new Game(params);
    }

    /**
     * @method CallbackGame
     * @param {Object} params - The parameters of the game
     * @returns {CallbackGame} - A new CallbackGame object
     */
    CallbackGame(params = {}) {
        class CallbackGame {
            constructor(params) {
                this.params = params;
            }
        }
        return new CallbackGame(params);
    }

    /**
     * @method GameHighScore
     * @param {Number} position - The position of the user in the game
     * @param {Object} user - The user object
     * @param {Number} score - The score of the user
     * @returns {GameHighScore} - A new GameHighScore object
     */
    GameHighScore(params = { position, user, score }) {
        class GameHighScore {
            constructor({ position, user, score }) {
                this.position = position;
                this.user = user ? new Type().user(user) : null;
                this.score = score;
            }
        }
        return new GameHighScore(params);
    }
}