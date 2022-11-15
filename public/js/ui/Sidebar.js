/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const btn = document.querySelector('a.sidebar-toggle');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const body = document.querySelector('body');
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');      
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const btnRegister = document.querySelector('.menu-item_register');
    btnRegister.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = App.getModal('register');
      modal.open();
    })
    const btnLogin = document.querySelector('.menu-item_login');
    btnLogin.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = App.getModal('login');
      modal.open();
    })   
    const btnLogout = document.querySelector('.menu-item_logout');
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      User.logout((err, response) => {
        if (err) {
          console.error(`Error logout: ${err}`);
        }
        if (response.success === true) {
          App.setState( 'init' );
        }
      });
    });
  }
}
