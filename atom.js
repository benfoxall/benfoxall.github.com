const formatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
});
for (const el of document.querySelectorAll("time")) {
  el.innerText = formatter.format(new Date(el.getAttribute("datetime")));
}
