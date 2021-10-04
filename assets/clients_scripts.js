$("document").ready(enable_update_button);

function enable_update_button()
{
    let enabled = $("input[name='client_name']")[0].value != '' &&
                  $("input[name='client_id']")[0].value != '' &&
                  $("input[name='redirect_uri']")[0].value != '' &&
                  $("input[name='client_secret']")[0].value != '';

      let button = $("button[name='modify']")[0];
      button.disabled = !enabled;
      if (!enabled)
          button.innerText = 'Please fill all text fields';

//    $("button[name='modify']").prop('disabled',true);
}

function update()
{
   let action = "Add New Client";
   if ($("input[name='id']")[0].value != '' )
   {
       // If there is id is an update
       action = "Update Client";
   }

   let button = $("button[name='modify']")[0];
   button.innerText = action;

   enable_update_button();
}
