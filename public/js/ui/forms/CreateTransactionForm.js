/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const user = User.current();
    if (user) {
      Account.list(user, (err, response) => {
        if (err){
          console.error('Ошибка получения списка счетов', err);
        }
        if (response) {
          const select = this.element.querySelector('select.accounts-select');
          this.clearSelect(select);
          const list = response.data;
          list.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            select.appendChild(option);
          });
        }
      });
    }
  }

  clearSelect(select) {
    const options = Array.from(select.querySelectorAll('option'));
    options.forEach(item => item.remove());
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response){
        this.element.reset();
        App.update();
        const modalID = this.element.closest('.modal').dataset.modalId;
        const modal = App.getModal(modalID);
        modal.close();
      }
      if (err) {
        console.error('Ошибка создания транзакции', err);
      }
    });
  }
}
