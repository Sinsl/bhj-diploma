/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (element === undefined) {
      throw Error('Элемент не существует');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        const section = e.target.closest('section');
        const nameClass = section.classList[0];
        switch (nameClass) {
          case 'content-header':
            this.removeAccount();
          break;
          case 'content':
            this.removeTransaction(btn.dataset.id);
          break;
          default:
            break;
        }
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions) {
      if( confirm("Вы действительно хотите удалить счёт?")) {
        let formData = new FormData();
        formData.append('id', this.lastOptions.account_id);

        Account.remove(formData, (err, response) => {
          if (err) console.error('Ошибка удаления счета', err);
          if (response.success === true) {
            App.updateWidgets();
            App.updateForms();
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm("Вы действительно хотите удалить эту транзакцию?")) {
      let formData = new FormData();
      formData.append('id', id);
      Transaction.remove(formData, (err, response) => {
        if (err) console.error('Ошибка удаления транзакции', err);
        if (response.success === true) {
          this.update();
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        if (err) console.error('Ошибка получения счета', err);
        if (response.success === true) {
          this.renderTitle(response.data.name);
        }
      });
      Transaction.list( options, (err, response) => {
        if (err) console.error('Ошибка получения транзакции', err);
        this.renderTransactions(response.data);
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const elemTitle = this.element.querySelector('span.content-title');
    elemTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const typeDate = new Date(date);
    const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return `${typeDate.getDate()} ${monthNames[typeDate.getMonth() - 1]} ${typeDate.getFullYear()} г. в ${typeDate.getHours()}:${typeDate.getMinutes()}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const divTransaction = document.createElement('div');
    divTransaction.classList.add('transaction', 'transaction_' + item.type, 'row');

    const divDetails = document.createElement('div');
    divDetails.classList.add('col-md-7', 'transaction__details');
    divTransaction.appendChild(divDetails);


    const divIcon = document.createElement('div');
    divIcon.classList.add('transaction__icon');
    divIcon.insertAdjacentHTML('beforeend', `<span class="fa fa-money fa-2x"></span>`);
    divDetails.appendChild(divIcon);

    const divInfo = document.createElement('div');
    divInfo.classList.add('transaction__info');
    divInfo.insertAdjacentHTML('beforeend', 
      `<h4 class="transaction__title">${item.name}</h4>
      <div class="transaction__date">${this.formatDate(item.created_at)}</div>`
    );
    divDetails.appendChild(divInfo);

    const divParentSum = document.createElement('div');
    divParentSum.classList.add('col-md-3');

    const divSum = document.createElement('div');
    divSum.classList.add('transaction__summ');
    divSum.insertAdjacentHTML('beforeend', `${item.sum} <span class="currency">₽</span>`);
    divParentSum.appendChild(divSum);

    divDetails.appendChild(divParentSum);

    const divControls = document.createElement('div');
    divControls.classList.add('col-md-2', 'transaction__controls');
    divControls.insertAdjacentHTML('beforeend',
      `<button class="btn btn-danger transaction__remove" data-id="${item.id}">
      <i class="fa fa-trash"></i>  
      </button>`
    );

    divDetails.appendChild(divControls);

    return divTransaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const section = this.element.querySelector('section.content');
    const transaction = Array.from(section.querySelectorAll('.transaction'));
    transaction.forEach(item => item.remove());
    data.forEach(item => {
      section.appendChild(this.getTransactionHTML(item));
    })
  }
}
