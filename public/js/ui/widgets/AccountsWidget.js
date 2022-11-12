/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (element === undefined) {
      throw Error('Элемент не существует');
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('create-account')) {
        const modal = new Modal(App.getModal('createAccount'));
        modal.open();
      } else {
        const elemLi = e.target.closest('.account');
        e.preventDefault();
        if (elemLi) this.onSelectAccount(elemLi);
      }
 
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const user = User.current();
    if (user !== undefined) {
      Account.list(user, (err, response) => {
        if (err) console.error('Ошибка получения списка счетов', err);
        if (response) {
          this.clear();
          const list = response.data;
          list.forEach(item => this.renderItem(item));
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const list = Array.from(document.querySelectorAll('li.account'));
    list.forEach(item => item.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const list = Array.from(document.querySelectorAll('li.account'));
    list.forEach(item => {
      if (item.classList.contains('active') === true) {
        item.classList.remove('active');
      }    
    });
    element.classList.add('active');
    App.showPage( 'transactions', { account_id: element.dataset.id });   
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const elem = document.createElement('li');
    elem.classList.add('account');
    elem.dataset.id = item.id;
    const elemLink = document.createElement('a');
    elemLink.href = '#';
    elemLink.insertAdjacentHTML('afterbegin',
      `<span>${item.name}</span> /
      <span>${item.sum} ₽</span>`
    );
    elem.appendChild(elemLink);
    return elem;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const widget = document.querySelector('ul.accounts-panel');
    widget.appendChild(this.getAccountHTML(data));
  }
}
