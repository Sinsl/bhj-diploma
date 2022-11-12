/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, response) => {
      if (response.user){
        this.element.reset();
        App.setState( 'user-logged' );
        const modalID = this.element.closest('.modal').dataset.modalId;
        const modal = new Modal(App.getModal(modalID));
        modal.close();
      }
      if (err) console.error('Ошибка авторизации', err);
    });
  }
}
