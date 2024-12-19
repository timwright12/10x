// +CUT+ your code goes here ...


document.addEventListener('DOMContentLoaded', function() {
    // Create a in-memory data structure to model the household.
    var household = [];

    // Storing variables
    var btnAdd = document.querySelector('button.add');
    var form = document.querySelector('form');
    var hh = document.querySelector('ol.household');
    var debug = document.querySelector('.debug');
    var ageEl = form.querySelector('#age');
    var relEl = form.querySelector('#rel');
    var smokerEl = form.querySelector('#smoker');

    // @TODO Prevent required fields from stopping submission since we're validating manually
    // @TODO sync with error API
    form.setAttribute('novalidate', 'true');

    // So an empty OL doesn't report, remove this when there are items
    hh.setAttribute('role', 'presentation');

    // Let screen readers know this area is updating
    hh.setAttribute('aria-atomic', 'true');
    debug.setAttribute('aria-atomic', 'true');

     // Be nice about it
    hh.setAttribute('aria-live', 'polite');
    debug.setAttribute('aria-live', 'polite');

    // Describe what types of changes have occurred
    hh.setAttribute('aria-relevant', 'additions removals');
    debug.setAttribute('aria-relevant', 'text');

    // Set up the age element
    ageEl.setAttribute('type', 'number');
    ageEl.setAttribute('min', '1');
    ageEl.setAttribute('required', 'required');
    
    // Set rel to announce as required
    relEl.setAttribute('required', 'required');
    
    // Add person to household.
    btnAdd.addEventListener('click', function(e) {
        e.preventDefault();

        // Storing some variables
        var form = this.parentNode.parentNode;
        var age = parseInt(+ageEl.value, 10);
        var relationship;
        var smoker;

        if (isNaN(age) || age < 1) {
            renderError(ageEl, 'This Field is Required.');
            return;
        } else {
          clearError(ageEl);
        }

        relationship = relEl.value;
        if (relationship === '') {
            renderError(relEl, 'This Field is Required.');
            return;
        } else {
          clearError(relEl);
        }

        smoker = form.querySelector('#smoker').checked;
        household.push({
            age: age,
            relationship: relationship,
            smoker: smoker
        });

        // Clear form for next entry
        ageEl.value = '';
        relEl.value = '';
        smokerEl.checked = false;

        // Set focus back to the first input (generic in case it changes)
        form.querySelector('input').focus();

        render();
    });

    // 'Submit' form.
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        debug.style.display = household.length > 0 ? 'block' : 'none';
        debug.innerText = JSON.stringify(household, null, 4);

        // Set focus to the debug output after submission
        debug.setAttribute('tabindex', '-1');
        debug.focus();
    });

    // Remove person from household.
    hh.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.className === 'remove') {
            var index = e.target.parentNode._householdIndex;
            household.splice(index, 1);
            render();
            setFocus();
        }
    });

    function renderError(el, msg) {

      var element = el;
      var id = element.getAttribute('id');
      var template;

      // Clear the previous error
      clearError(el);

      template = document.createElement('div');
      template.setAttribute('id', 'error-for-' + id);
      template.innerHTML = msg;
      template.style.color = 'red';

      element.setAttribute('aria-invalid', 'true');
      element.setAttribute('aria-describedby', 'error-for-' + id);

      // Insert the error
      element.parentNode.insertBefore(template, element.nextSibling);

      // Set focus to the erroring field
      element.focus();
    }

    function clearError(el) {
      var element = el;
      var id = element.getAttribute('id');
      var error = document.getElementById('error-for-' + id);

      if (error) {
        element.removeAttribute('aria-invalid');
        element.removeAttribute('aria-describedby');
        error.remove();
      }
    }

    // After removing an item focus on the first remove button or the form input
    function setFocus() {
      var firstRemoveButton = hh.querySelector('.remove');
      var firstFormInput = form.querySelector('input');

      if (firstRemoveButton) {
        firstRemoveButton.focus();
      } else {
        firstFormInput.focus();
      }
    }

    // Render the form from the model + the template.
    function render() {

        // Clear the existing list of people.
        while (hh.firstChild) {
            hh.removeChild(hh.firstChild);
        }

        // If we have items in the household, remove the presentational role
        if (household.length > 0) {
          hh.removeAttribute('role');
        } else {
          hh.setAttribute('role', 'presentation');
        }

        household.forEach(function(person, index) {
            var count = index + 1;
            var dom = document.createElement('li');

            dom.className = 'person';
            dom.id = 'hh-' + index;

            var template =
                '<strong>Age:</strong> ' + person.age + '<br>' +
                '<strong>Relationship:</strong> ' + person.relationship + '<br>' +
                '<strong>Smoker?</strong> ' + (person.smoker ? 'yes' : 'no') + '<br>' +
                '<button type="button" class="remove">Remove member: ' + count + '</button>';
            dom.innerHTML = template;
            dom._householdIndex = index;
            hh.appendChild(dom);
        });
    }
});
