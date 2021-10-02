// Not checked with any input types like radio, checkbox
export const serialize = (els) => {
    // https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
    return els.map(el => encodeURIComponent(el.name) + "=" + encodeURIComponent(el.value).replace(/%20/g, "+").replace(/\r?\n/g, "\r\n")).join("&");
};
//# sourceMappingURL=serialize.js.map