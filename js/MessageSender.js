export default class MessageSender {
    constructor(element, onSend) {
        this.onSend = onSend;
        this.messageInput = element.querySelector('[data-role="message-input"]');
        this.MessageSendButton = element.querySelector('[data-role="message-send-button"]');

        this.MessageSendButton.addEventListener('click', () => {
            const message = this.messageInput.value.trim();

            if (message) {
                this.onSend(message);
            }
        });
    }

    clear() {
        this.messageInput.value = '';
    }
}