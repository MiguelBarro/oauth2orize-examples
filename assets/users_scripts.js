$("document").ready(enable_update_button);

function enable_update_button()
{
    let enabled = $("input[name='user_name']")[0].value != '' &&
                  $("input[name='user_password']")[0].value != '';

      let button = $("button[name='modify']")[0];
      button.disabled = !enabled;
      if (!enabled)
          button.innerText = 'Please fill all text fields';

//    $("button[name='modify']").prop('disabled',true);
}

function update()
{
   let action = "Add New User";
   if ($("input[name='id']")[0].value != '' )
   {
       // If there is id is an update
       action = "Update User";
   }

   let button = $("button[name='modify']")[0];
   button.innerText = action;

   enable_update_button();
}
