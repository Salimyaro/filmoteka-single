# salimov-filmoteka

Индивидуальная реализация командного финального проэкта по js.

# ТЗ: https://docs.google.com/spreadsheets/d/1xznttn6bvxeMyIuJWg7daMGIQGBi31rfuRsaBtV0L0M/edit#gid=0

# Макет: https://www.figma.com/file/lA5plQSUEbIKOSJHfuPpXO/Filmoteka?node-id=0%3A1

Собрано на parcel который настроен самостоятельно.

Затрачено примерно 20 часов на написание.

Есть 2 html страницы которые использую один файл стилей и один файл скриптов, для того чтобы не подгружать новые файлы при переключениями между страницами.

Верстка mobile first, responsive.

Данные клиента сохранены в local storage.

# Реализовано:
	1. Простое отлавливание ошибок при поисковом запросе.
	2. На главной странице подгружаются трендовые фильмы.
	3. Пагинация на главной странице (тренды и поисковые запросы).
	4. Показ полной информации о фильме в модальном окне.
	5. В модальном окне можно добавить фильм в queue list или watched, при доавлении в watched если данный фильм был в queue list он автоматически удаляеться из queue list и наоборот.
	6. Закрытие модалки на главной странице: при нажатии на Х, пустую область вокруг модалки, при добавлении в один из списков.
	7. Закрытие модалки на странице библиотек: при нажатии на Х, пустую область вокруг модалки.
	8. На странице библиотек, по умолчанию, отрисовываются карточки watched, или при нажатии кнопки watched.
	9. На странице библиотек отрисовываются карточки queue list при нажатии кнопки queue.
	10. Карточки в модальном окне проверяют наличие данного фильма в списках библиотек и применяют нужные стили на кнопки, а также меняют подписи кнопок.
	11. На странице библиотек, в модальном окне при перемещении фильма в другой список, на фоне перерисовывается выбранный список.
	12. Фоновое изображение header выполнено с поддержкой retina display

# Found bugs:
	1. на iOS в поиске Label и кнопка поиска сползли под input.
