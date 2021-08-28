<?php
  if(isset($_POST['linkimg'])&&isset($_POST['caption'])){


      date_default_timezone_set('America/Santo_Domingo');
      define('UPLOAD_DIR', 'Data/img/');  
      $img = $_POST['linkimg'];  
      $img = str_replace('data:image/png;base64,', '', $img);  
      $img = str_replace(' ', '+', $img);  
      $data = base64_decode($img);  
      $file = UPLOAD_DIR . date("d_F_Y_h_i_s_a") . '.png';  
      $namePhoto=date("d_F_Y_h_i_s_a") . '.png';
      $success = file_put_contents($file, $data);  

      #sendPhoto($namePhoto);
      echo $namePhoto;
      $GLOBALS['photo']=$namePhoto;
      
  }


  function sendPhoto($path){
    $myfile = realpath("Data/img/".$path);

    $chat_id="-1001359127742";
    $bot_url= "https://api.telegram.org/bot1679501174:AAELOnIx1S3ELin-TP1hDuxT-SpU8XhCwHs/";
    $url= $bot_url . "sendPhoto?chat_id=" . $chat_id."&caption=".$_POST['caption'] ;

    $post_fields = array('chat_id'   => $chat_id,
        'photo'     => new CURLFile($myfile)
    );

    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Content-Type:multipart/form-data"
    ));
    curl_setopt($ch, CURLOPT_URL, $url); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields); 
    $output = curl_exec($ch);


  }


?>