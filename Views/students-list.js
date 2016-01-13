var StudentsListView = Backbone.View.extend({

  el: "#app",

  events: {
    'submit form': 'addStudent',
    'change input[type="radio"]': 'presenceStudent'
  },

  addStudent : function (event) {

    event.preventDefault();

    //on récupère les éléments du form et on les met attribue à des variables
    var $form = $(event.currentTarget);
    var studentFirstName = $form.find('.student-firstname').val();
    var studentLastName = $form.find('.student-lastname').val();
    // console.log(studentFirstName, studentLastName);

    //on crée un nouvel élève avec les variables
    var newStudentModel = new StudentModel({
      firstName: studentFirstName,
      lastName: studentLastName
    });

    //je l'ajoute à la collection
    this.myStudentCollection.add(newStudentModel);

    newStudentModel.save();

    this.render();
  },

  initialize: function() {

    // On lie la collection à la vue en l'instanciant à l'intérieur de la vue
    this.myStudentCollection = new StudentsCollection();

    this.myStudentCollection.fetch();

    // On rend la vue une première fois
    this.render();
  },

  render: function () {
    var $renderTarget = this.$('.student-list')

    $renderTarget.empty();

    var allMyStudents = this.myStudentCollection.toJSON();
    for (var i = 0; i < allMyStudents.length; i++) {
      var student = allMyStudents[i];
      var studentTemplate = this.getTemplate(student);
      $renderTarget.append(studentTemplate);
    }

    // on change le compteur d'élèves
    var studentTotal = this.myStudentCollection.length;
    // console.log(studentTotal);
    $( ".student-total" ).empty();
    $( ".student-total" ).append(studentTotal);

  },

  getTemplate: function (studentData) {

    var isPresentChecked = '';
    var isAbsentChecked = 'checked';

    if (studentData.present) {
      isPresentChecked = 'checked';
      isAbsentChecked = '';
    }

    var studentTemplate = '\
    <li>\
      <h2>' + studentData.firstName + ' ' + studentData.lastName + '</h2>\
      <form data-name="'+ studentData.lastName +'">\
        <label>Présent</label>\
        <input '+ isPresentChecked +' type="radio" class="student-present" name="student" value="present"/>\
        <label>Absent</label>\
        <input '+ isAbsentChecked +' type="radio" class="student-absent" name="student" value="absent"/>\
      </form>\
    </li>\
  ';

  return $(studentTemplate);
},

  presenceStudent: function (event) {

    var $input = $(event.currentTarget);
    var inputValue = $input.val();
    var allMyStudents = this.myStudentCollection.toJSON();
    var student = this.myStudentCollection.findWhere({
      lastName: $input.parents('form').attr('data-name')
    });

    if (inputValue == 'present') {
      student.set({
        present: true,
      })
    } else {
      student.set({
        present: false,
      })
    };

    student.save();


    var presentStudents = this.myStudentCollection.where({
      present: true,
    });

    var presenceNumber = presentStudents.length;

    var absenceNumber = allMyStudents.length - presenceNumber;

    $( ".student-present" ).empty();
    $( ".student-present" ).append(presenceNumber);
    $( ".student-absent" ).empty();
    $( ".student-absent" ).append(absenceNumber);

    // console.log(presenceNumber, absenceNumber);
  }

});
