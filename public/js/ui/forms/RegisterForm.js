/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, response) => {
      if (response.user){
        this.element.reset();
        App.setState( 'user-logged' );
        const modalID = this.element.closest('.modal').dataset.modalId;
        const modal = new Modal(App.getModal(modalID));
        modal.close();

        
      }
      if (err) console.error('Ошибка регистрации', err);
    });
  }
}