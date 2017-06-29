var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var nodemailer = require('nodemailer');
var events = require('events');
var jwt = require('jsonwebtoken');
var FCM = require('fcm-push');
var eventEmitter = new events.EventEmitter();
//import models schema
var User = require('../models/user');
var TempUser = require('../models/tempuser');
var RequestNewPassword = require('../models/request');
var config = require('../../config/database');
var Session = require('../models/session');
var request = require('request');
//setup the gmail config

//send email with mail mandrillapp
//ADDING stmpTransportMethod

////////// remove user pass //// 
var smtpTransport = nodemailer.createTransport(
    {   
        host: 'smtp.mandrillapp.com',
        port: 587,
        secure: false,
        auth: {
        //
        }
    }
);

var mailOptions, host, link;

/*
    parameter : {
        name : String,
        email : String,
        password : String
    }
*/
router.post('/signup', function (req, res) {
    var tempUser = new TempUser();
    User.findOne({ 'facebook.email': req.body.email }, function (err, resultfb) {
        if (err) {
            console.log(err);
        } else {
            if (resultfb == null) {
                //no facebook user
                User.findOne({ 'local.email': req.body.email }, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result == null) {
                            //no this email in the system
                            console.log('you can use this email');
                            var rand = uuid.v4();
                            host = req.get('host');
                            //link = "https://" + req.get('host') + "/api/verify?id=" + rand;
                            link = "https://horoscope.lisaguru.com"+"/api/verfiy?id="+rand;
                            mailOptions = {
                                from: "Lisaguru <noreply@lisaguru.com>",
                                sender: "noreply@lisaguru.com",
                                replyTo: "noreply@lisaguru.com",
                                to: req.body.email,
                                subject: "Please verify your email address",
                                html: "<!doctype html><html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><!-- NAME: 1 COLUMN --><!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta charset='UTF-8'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta name='viewport' content='width=device-width, initial-scale=1'><title>*|MC:SUBJECT|*</title> <style type='text/css'>p{margin:10px 0;padding:0;}table{border-collapse:collapse;}h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0;}img,a img{border:0;height:auto;outline:none;text-decoration:none;}body,#bodyTable,#bodyCell{height:100%;margin:0;padding:0;width:100%;}#outlook a{padding:0;}img{-ms-interpolation-mode:bicubic;}table{mso-table-lspace:0pt;mso-table-rspace:0pt;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}p,a,li,td,blockquote{mso-line-height-rule:exactly;}a[href^=tel],a[href^=sms]{color:inherit;cursor:default;text-decoration:none;}p,a,li,td,body,table,blockquote{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%;}a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important;}#bodyCell{padding:10px;}.templateContainer{max-width:600px !important;}a.mcnButton{display:block;}.mcnImage{vertical-align:bottom;}.mcnTextContent{word-break:break-word;}.mcnTextContent img{height:auto !important;}.mcnDividerBlock{table-layout:fixed !important;}/*@tab Page@section Background Style@tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.*/body,#bodyTable{/*@editable*/background-color:#FAFAFA;}/*@tab Page@section Background Style@tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.*/#bodyCell{/*@editable*/border-top:0;}/*@tab Page@section Email Border@tip Set the border for your email.*/.templateContainer{/*@editable*/border:0;}/*@tab Page@section Heading 1@tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.@style heading 1*/h1{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:26px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Page@section Heading 2@tip Set the styling for all second-level headings in your emails.@style heading 2*/h2{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:22px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Page@section Heading 3@tip Set the styling for all third-level headings in your emails.@style heading 3*/h3{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:20px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Page@section Heading 4@tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.@style heading 4*/h4{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:18px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Preheader@section Preheader Style@tip Set the background color and borders for your email's preheader area.*/#templatePreheader{/*@editable*/background-color:#FAFAFA;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:0;/*@editable*/padding-top:9px;/*@editable*/padding-bottom:9px;}/*@tab Preheader@section Preheader Text@tip Set the styling for your email's preheader text. Choose a size and color that is easy to read.*/#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{/*@editable*/color:#656565;/*@editable*/font-family:Helvetica;/*@editable*/font-size:12px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Preheader@section Preheader Link@tip Set the styling for your email's preheader links. Choose a color that helps them stand out from your text.*/#templatePreheader .mcnTextContent a,#templatePreheader .mcnTextContent p a{/*@editable*/color:#656565;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Header@section Header Style@tip Set the background color and borders for your email's header area.*/#templateHeader{/*@editable*/background-color:#FFFFFF;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:0;/*@editable*/padding-top:9px;/*@editable*/padding-bottom:0;}/*@tab Header@section Header Text@tip Set the styling for your email's header text. Choose a size and color that is easy to read.*/#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:16px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Header@section Header Link@tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.*/#templateHeader .mcnTextContent a,#templateHeader .mcnTextContent p a{/*@editable*/color:#2BAADF;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Body@section Body Style@tip Set the background color and borders for your email's body area.*/#templateBody{/*@editable*/background-color:#FFFFFF;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:2px solid #EAEAEA;/*@editable*/padding-top:0;/*@editable*/padding-bottom:9px;}/*@tab Body@section Body Text@tip Set the styling for your email's body text. Choose a size and color that is easy to read.*/#templateBody .mcnTextContent,#templateBody .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:16px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Body@section Body Link@tip Set the styling for your email's body links. Choose a color that helps them stand out from your text.*/#templateBody .mcnTextContent a,#templateBody .mcnTextContent p a{/*@editable*/color:#2BAADF;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Footer@section Footer Style@tip Set the background color and borders for your email's footer area.*/#templateFooter{/*@editable*/background-color:#FAFAFA;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:0;/*@editable*/padding-top:9px;/*@editable*/padding-bottom:9px;}/*@tab Footer@section Footer Text@tip Set the styling for your email's footer text. Choose a size and color that is easy to read.*/#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{/*@editable*/color:#656565;/*@editable*/font-family:Helvetica;/*@editable*/font-size:12px;/*@editable*/line-height:150%;/*@editable*/text-align:center;}/*@tab Footer@section Footer Link@tip Set the styling for your email's footer links. Choose a color that helps them stand out from your text.*/#templateFooter .mcnTextContent a,#templateFooter .mcnTextContent p a{/*@editable*/color:#656565;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}@media only screen and (min-width:768px){.templateContainer{width:600px !important;}}@media only screen and (max-width: 480px){body,table,td,p,a,li,blockquote{-webkit-text-size-adjust:none !important;}}@media only screen and (max-width: 480px){body{width:100% !important;min-width:100% !important;}}@media only screen and (max-width: 480px){#bodyCell{padding-top:10px !important;}}@media only screen and (max-width: 480px){.mcnImage{width:100% !important;}}@media only screen and (max-width: 480px){.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer{max-width:100% !important;width:100% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer{min-width:100% !important;}}@media only screen and (max-width: 480px){.mcnImageGroupContent{padding:9px !important;}}@media only screen and (max-width: 480px){.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{padding-top:9px !important;}}@media only screen and (max-width: 480px){.mcnImageCardTopImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{padding-top:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardBottomImageContent{padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockInner{padding-top:0 !important;padding-bottom:0 !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockOuter{padding-top:9px !important;padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnTextContent,.mcnBoxedTextContentColumn{padding-right:18px !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{padding-right:18px !important;padding-bottom:0 !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcpreview-image-uploader{display:none !important;width:100% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 1@tip Make the first-level headings larger in size for better readability on small screens.*/h1{/*@editable*/font-size:22px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 2@tip Make the second-level headings larger in size for better readability on small screens.*/h2{/*@editable*/font-size:20px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 3@tip Make the third-level headings larger in size for better readability on small screens.*/h3{/*@editable*/font-size:18px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 4@tip Make the fourth-level headings larger in size for better readability on small screens.*/h4{/*@editable*/font-size:16px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Boxed Text@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Visibility@tip Set the visibility of the email's preheader on small screens. You can hide it to save space.*/#templatePreheader{/*@editable*/display:block !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Text@tip Make the preheader text larger in size for better readability on small screens.*/#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Header Text@tip Make the header text larger in size for better readability on small screens.*/#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{/*@editable*/font-size:16px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Body Text@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/#templateBody .mcnTextContent,#templateBody .mcnTextContent p{/*@editable*/font-size:16px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Footer Text@tip Make the footer content text larger in size for better readability on small screens.*/#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:150% !important;}}</style></head> <body> <center> <table align='center' border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'> <tr> <td align='center' valign='top' id='bodyCell'> <!-- BEGIN TEMPLATE // --><!--[if gte mso 9]><table align='center' border='0' cellspacing='0' cellpadding='0' width='600' style='width:600px;'><tr><td align='center' valign='top' width='600' style='width:600px;'><![endif]--> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='templateContainer'> <tr> <td valign='top' id='templatePreheader'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnBoxedTextBlock' style='min-width:100%;'> <!--[if gte mso 9]><table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'><![endif]--><tbody class='mcnBoxedTextBlockOuter'> <tr> <td valign='top' class='mcnBoxedTextBlockInner'> <!--[if gte mso 9]><td align='center' valign='top' '><![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width:100%;' class='mcnBoxedTextContentContainer'> <tbody><tr> <td style='padding-top:9px; padding-left:18px; padding-bottom:9px; padding-right:18px;'> <table border='0' cellpadding='18' cellspacing='0' class='mcnTextContentContainer' width='100%' style='min-width: 100% !important;background-color: #EB008B;'> <tbody><tr> <td valign='top' class='mcnTextContent' style='color: #F2F2F2;font-family: Helvetica;font-size: 14px;font-weight: normal;text-align: center;'> <div style='text-align: center;'><img align='none' height='65' src='https://gallery.mailchimp.com/245cddd383d7409313b2b88d3/images/b01272b2-132a-4643-892a-c4b7b4ecbab7.png' style='width: 150px; height: 65px; margin: 0px;' width='150'></div> </td> </tr> </tbody></table> </td> </tr> </tbody></table><!--[if gte mso 9]></td><![endif]--> <!--[if gte mso 9]> </tr> </table><![endif]--> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateHeader'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnImageCardBlock'> <tbody class='mcnImageCardBlockOuter'> <tr> <td class='mcnImageCardBlockInner' valign='top' style='padding-top:9px; padding-right:18px; padding-bottom:9px; padding-left:18px;'> <table align='right' border='0' cellpadding='0' cellspacing='0' class='mcnImageCardBottomContent' width='100%'> <tbody><tr> <td class='mcnImageCardBottomImageContent' align='left' valign='top' style='padding-top:0px; padding-right:0px; padding-bottom:0; padding-left:0px;'> <img alt='' src='https://gallery.mailchimp.com/245cddd383d7409313b2b88d3/images/9b364839-cfca-4d66-8753-73ed93800452.jpg' width='564' style='max-width:564px;' class='mcnImage'> </td> </tr> <tr> <td class='mcnTextContent' valign='top' style='padding: 9px 18px; font-family: Helvetica; font-size: 14px; font-weight: normal; text-align: center;' width='546'> <h1 class='null' style='text-align: left;'><span style='font-size:16px'><span style='line-height:26.4px'>Hello,<br>Please verify your email address so we know that it’s really you.</span></span></h1> </td> </tr></tbody></table> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateBody'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnButtonBlock' style='min-width:100%;'> <tbody class='mcnButtonBlockOuter'> <tr> <td style='padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;' valign='top' align='center' class='mcnButtonBlockInner'> <table border='0' cellpadding='0' cellspacing='0' class='mcnButtonContentContainer' style='border-collapse: separate !important;border-radius: 5px;background-color: #E5007D;'> <tbody> <tr> <td align='center' valign='middle' class='mcnButtonContent' style='font-family: Arial; font-size: 16px; padding: 15px;'> <a class='mcnButton ' title='Click here to verify' href='" + link + "' target='_blank' style='font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;'>Click here to verify</a> </td> </tr> </tbody> </table> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateFooter'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnDividerBlock' style='min-width:100%;'> <tbody class='mcnDividerBlockOuter'> <tr> <td class='mcnDividerBlockInner' style='min-width: 100%; padding: 10px 18px;'> <table class='mcnDividerContent' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-top: 2px solid #EAEAEA;'> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table><!-- <td class='mcnDividerBlockInner' style='padding: 18px;'> <hr class='mcnDividerContent' style='border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;' />--> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowBlock' style='min-width:100%;'> <tbody class='mcnFollowBlockOuter'> <tr> <td align='center' valign='top' style='padding:9px' class='mcnFollowBlockInner'> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowContentContainer' style='min-width:100%;'> <tbody><tr> <td align='center' style='padding-left:9px;padding-right:9px;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width:100%;' class='mcnFollowContent'> <tbody><tr> <td align='center' valign='top' style='padding-top:9px; padding-right:9px; padding-left:9px;'> <table align='center' border='0' cellpadding='0' cellspacing='0'> <tbody><tr> <td align='center' valign='top'> <!--[if mso]> <table align='center' border='0' cellspacing='0' cellpadding='0'> <tr> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='http://www.facebook.com/lisaguru' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-facebook-96.png' alt='Facebook' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='http://www.lisaguru.com' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-link-96.png' alt='Website' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='https://www.youtube.com/user/lisagurutv' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-youtube-96.png' alt='YouTube' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='http://instagram.com/LISA_GURU' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-instagram-96.png' alt='Instagram' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:0; padding-bottom:9px;'> <a href='http://www.twitter.com/lisaguru' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-twitter-96.png' alt='Twitter' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr></tbody></table> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnDividerBlock' style='min-width:100%;'> <tbody class='mcnDividerBlockOuter'> <tr> <td class='mcnDividerBlockInner' style='min-width: 100%; padding: 10px 18px 25px;'> <table class='mcnDividerContent' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-top: 2px solid #EEEEEE;'> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table><!-- <td class='mcnDividerBlockInner' style='padding: 18px;'> <hr class='mcnDividerContent' style='border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;' />--> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnTextBlock' style='min-width:100%;'> <tbody class='mcnTextBlockOuter'> <tr> <td valign='top' class='mcnTextBlockInner' style='padding-top:9px;'> <!--[if mso]><table align='left' border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100%;'><tr><![endif]--> <!--[if mso]><td valign='top' width='600' style='width:600px;'><![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' style='max-width:100%; min-width:100%;' width='100%' class='mcnTextContentContainer'> <tbody><tr> <td valign='top' class='mcnTextContent' style='padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;'> <em>Copyright © 2017 Burda Thailand Co., Ltd All rights reserved.</em><br><br><strong>Our mailing address is:</strong><br><a href='mailto:infolisa@burda.co.th' target='_blank'>infolisa@burda.co.th</a><br><br>&nbsp; </td> </tr> </tbody></table><!--[if mso]></td><![endif]--> <!--[if mso]></tr></table><![endif]--> </td> </tr> </tbody></table></td> </tr> </table><!--[if gte mso 9]></td></tr></table><![endif]--> <!-- // END TEMPLATE --> </td> </tr> </table> </center> </body></html>"
                            }
                            console.log(mailOptions);
                            tempUser.id = rand;
                            tempUser.name = req.body.name;
                            tempUser.email = req.body.email;
                            tempUser.password = req.body.password;
                            smtpTransport.sendMail(mailOptions, function (error, response) {
                                if (error) {
                                    console.log(error);
                                    res.end(err);
                                } else {
                                    tempUser.save(function (err) {
                                        if (err) {
                                            res.end(err);
                                        } else {
                                            console.log('Save temp user already');
                                            console.log('Wait for verify email');
                                            res.json({ error: false, title: "Sign up successfull", message: 'Please verify your email address' });
                                            //res.end('Wait....');
                                        }
                                    });
                                    console.log("Message send: " + response.message);
                                }
                            });
                        } else {
                            console.log('This email was already taken');
                            //res.end('this email is already taken');
                            res.json({ error: true, title: 'Sign up failed', message: 'This email is already taken' });
                        }
                    }
                });
            } else {
                console.log('This email was already taken in facebook ID');
                res.json({ error: true, title: 'Sign up failed', message: 'This email is already taken' });
            }
        }
    })


});
//resend the verification email 
router.post('/resendEmail', function (req, res) {
    TempUser.findOne({ 'email': req.body.email }, function (err, result) {
        if (err) {
            throw err;
        } else {
            if (result != null) {
                //link = "https://" + req.get('host') + "/api/verify?id=" + result.id;
                link = "https://horoscope.lisaguru.com"+"/api/verfiy?id="+result.id;
                mailOptions = {
                    from: "Lisaguru <noreply@lisaguru.com>",
                    sender: "noreply@lisaguru.com",
                    replyTo: "noreply@lisaguru.com",
                    to: result.email,
                    subject: "Please verify your email address",
                    html: "<!doctype html><html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><!-- NAME: 1 COLUMN --><!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta charset='UTF-8'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta name='viewport' content='width=device-width, initial-scale=1'><title>*|MC:SUBJECT|*</title> <style type='text/css'>p{margin:10px 0;padding:0;}table{border-collapse:collapse;}h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0;}img,a img{border:0;height:auto;outline:none;text-decoration:none;}body,#bodyTable,#bodyCell{height:100%;margin:0;padding:0;width:100%;}#outlook a{padding:0;}img{-ms-interpolation-mode:bicubic;}table{mso-table-lspace:0pt;mso-table-rspace:0pt;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}p,a,li,td,blockquote{mso-line-height-rule:exactly;}a[href^=tel],a[href^=sms]{color:inherit;cursor:default;text-decoration:none;}p,a,li,td,body,table,blockquote{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%;}a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important;}#bodyCell{padding:10px;}.templateContainer{max-width:600px !important;}a.mcnButton{display:block;}.mcnImage{vertical-align:bottom;}.mcnTextContent{word-break:break-word;}.mcnTextContent img{height:auto !important;}.mcnDividerBlock{table-layout:fixed !important;}/*@tab Page@section Background Style@tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.*/body,#bodyTable{/*@editable*/background-color:#FAFAFA;}/*@tab Page@section Background Style@tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.*/#bodyCell{/*@editable*/border-top:0;}/*@tab Page@section Email Border@tip Set the border for your email.*/.templateContainer{/*@editable*/border:0;}/*@tab Page@section Heading 1@tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.@style heading 1*/h1{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:26px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Page@section Heading 2@tip Set the styling for all second-level headings in your emails.@style heading 2*/h2{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:22px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Page@section Heading 3@tip Set the styling for all third-level headings in your emails.@style heading 3*/h3{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:20px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Page@section Heading 4@tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.@style heading 4*/h4{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:18px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Preheader@section Preheader Style@tip Set the background color and borders for your email's preheader area.*/#templatePreheader{/*@editable*/background-color:#FAFAFA;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:0;/*@editable*/padding-top:9px;/*@editable*/padding-bottom:9px;}/*@tab Preheader@section Preheader Text@tip Set the styling for your email's preheader text. Choose a size and color that is easy to read.*/#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{/*@editable*/color:#656565;/*@editable*/font-family:Helvetica;/*@editable*/font-size:12px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Preheader@section Preheader Link@tip Set the styling for your email's preheader links. Choose a color that helps them stand out from your text.*/#templatePreheader .mcnTextContent a,#templatePreheader .mcnTextContent p a{/*@editable*/color:#656565;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Header@section Header Style@tip Set the background color and borders for your email's header area.*/#templateHeader{/*@editable*/background-color:#FFFFFF;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:0;/*@editable*/padding-top:9px;/*@editable*/padding-bottom:0;}/*@tab Header@section Header Text@tip Set the styling for your email's header text. Choose a size and color that is easy to read.*/#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:16px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Header@section Header Link@tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.*/#templateHeader .mcnTextContent a,#templateHeader .mcnTextContent p a{/*@editable*/color:#2BAADF;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Body@section Body Style@tip Set the background color and borders for your email's body area.*/#templateBody{/*@editable*/background-color:#FFFFFF;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:2px solid #EAEAEA;/*@editable*/padding-top:0;/*@editable*/padding-bottom:9px;}/*@tab Body@section Body Text@tip Set the styling for your email's body text. Choose a size and color that is easy to read.*/#templateBody .mcnTextContent,#templateBody .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:16px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Body@section Body Link@tip Set the styling for your email's body links. Choose a color that helps them stand out from your text.*/#templateBody .mcnTextContent a,#templateBody .mcnTextContent p a{/*@editable*/color:#2BAADF;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Footer@section Footer Style@tip Set the background color and borders for your email's footer area.*/#templateFooter{/*@editable*/background-color:#FAFAFA;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:0;/*@editable*/padding-top:9px;/*@editable*/padding-bottom:9px;}/*@tab Footer@section Footer Text@tip Set the styling for your email's footer text. Choose a size and color that is easy to read.*/#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{/*@editable*/color:#656565;/*@editable*/font-family:Helvetica;/*@editable*/font-size:12px;/*@editable*/line-height:150%;/*@editable*/text-align:center;}/*@tab Footer@section Footer Link@tip Set the styling for your email's footer links. Choose a color that helps them stand out from your text.*/#templateFooter .mcnTextContent a,#templateFooter .mcnTextContent p a{/*@editable*/color:#656565;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}@media only screen and (min-width:768px){.templateContainer{width:600px !important;}}@media only screen and (max-width: 480px){body,table,td,p,a,li,blockquote{-webkit-text-size-adjust:none !important;}}@media only screen and (max-width: 480px){body{width:100% !important;min-width:100% !important;}}@media only screen and (max-width: 480px){#bodyCell{padding-top:10px !important;}}@media only screen and (max-width: 480px){.mcnImage{width:100% !important;}}@media only screen and (max-width: 480px){.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer{max-width:100% !important;width:100% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer{min-width:100% !important;}}@media only screen and (max-width: 480px){.mcnImageGroupContent{padding:9px !important;}}@media only screen and (max-width: 480px){.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{padding-top:9px !important;}}@media only screen and (max-width: 480px){.mcnImageCardTopImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{padding-top:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardBottomImageContent{padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockInner{padding-top:0 !important;padding-bottom:0 !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockOuter{padding-top:9px !important;padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnTextContent,.mcnBoxedTextContentColumn{padding-right:18px !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{padding-right:18px !important;padding-bottom:0 !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcpreview-image-uploader{display:none !important;width:100% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 1@tip Make the first-level headings larger in size for better readability on small screens.*/h1{/*@editable*/font-size:22px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 2@tip Make the second-level headings larger in size for better readability on small screens.*/h2{/*@editable*/font-size:20px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 3@tip Make the third-level headings larger in size for better readability on small screens.*/h3{/*@editable*/font-size:18px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 4@tip Make the fourth-level headings larger in size for better readability on small screens.*/h4{/*@editable*/font-size:16px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Boxed Text@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Visibility@tip Set the visibility of the email's preheader on small screens. You can hide it to save space.*/#templatePreheader{/*@editable*/display:block !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Text@tip Make the preheader text larger in size for better readability on small screens.*/#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Header Text@tip Make the header text larger in size for better readability on small screens.*/#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{/*@editable*/font-size:16px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Body Text@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/#templateBody .mcnTextContent,#templateBody .mcnTextContent p{/*@editable*/font-size:16px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Footer Text@tip Make the footer content text larger in size for better readability on small screens.*/#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:150% !important;}}</style></head> <body> <center> <table align='center' border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'> <tr> <td align='center' valign='top' id='bodyCell'> <!-- BEGIN TEMPLATE // --><!--[if gte mso 9]><table align='center' border='0' cellspacing='0' cellpadding='0' width='600' style='width:600px;'><tr><td align='center' valign='top' width='600' style='width:600px;'><![endif]--> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='templateContainer'> <tr> <td valign='top' id='templatePreheader'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnBoxedTextBlock' style='min-width:100%;'> <!--[if gte mso 9]><table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'><![endif]--><tbody class='mcnBoxedTextBlockOuter'> <tr> <td valign='top' class='mcnBoxedTextBlockInner'> <!--[if gte mso 9]><td align='center' valign='top' '><![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width:100%;' class='mcnBoxedTextContentContainer'> <tbody><tr> <td style='padding-top:9px; padding-left:18px; padding-bottom:9px; padding-right:18px;'> <table border='0' cellpadding='18' cellspacing='0' class='mcnTextContentContainer' width='100%' style='min-width: 100% !important;background-color: #EB008B;'> <tbody><tr> <td valign='top' class='mcnTextContent' style='color: #F2F2F2;font-family: Helvetica;font-size: 14px;font-weight: normal;text-align: center;'> <div style='text-align: center;'><img align='none' height='65' src='https://gallery.mailchimp.com/245cddd383d7409313b2b88d3/images/b01272b2-132a-4643-892a-c4b7b4ecbab7.png' style='width: 150px; height: 65px; margin: 0px;' width='150'></div> </td> </tr> </tbody></table> </td> </tr> </tbody></table><!--[if gte mso 9]></td><![endif]--> <!--[if gte mso 9]> </tr> </table><![endif]--> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateHeader'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnImageCardBlock'> <tbody class='mcnImageCardBlockOuter'> <tr> <td class='mcnImageCardBlockInner' valign='top' style='padding-top:9px; padding-right:18px; padding-bottom:9px; padding-left:18px;'> <table align='right' border='0' cellpadding='0' cellspacing='0' class='mcnImageCardBottomContent' width='100%'> <tbody><tr> <td class='mcnImageCardBottomImageContent' align='left' valign='top' style='padding-top:0px; padding-right:0px; padding-bottom:0; padding-left:0px;'> <img alt='' src='https://gallery.mailchimp.com/245cddd383d7409313b2b88d3/images/9b364839-cfca-4d66-8753-73ed93800452.jpg' width='564' style='max-width:564px;' class='mcnImage'> </td> </tr> <tr> <td class='mcnTextContent' valign='top' style='padding: 9px 18px; font-family: Helvetica; font-size: 14px; font-weight: normal; text-align: center;' width='546'> <h1 class='null' style='text-align: left;'><span style='font-size:16px'><span style='line-height:26.4px'>Hello,<br>Please verify your email address so we know that it’s really you.</span></span></h1> </td> </tr></tbody></table> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateBody'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnButtonBlock' style='min-width:100%;'> <tbody class='mcnButtonBlockOuter'> <tr> <td style='padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;' valign='top' align='center' class='mcnButtonBlockInner'> <table border='0' cellpadding='0' cellspacing='0' class='mcnButtonContentContainer' style='border-collapse: separate !important;border-radius: 5px;background-color: #E5007D;'> <tbody> <tr> <td align='center' valign='middle' class='mcnButtonContent' style='font-family: Arial; font-size: 16px; padding: 15px;'> <a class='mcnButton ' title='Click here to verify' href='" + link + "' target='_blank' style='font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;'>Click here to verify</a> </td> </tr> </tbody> </table> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateFooter'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnDividerBlock' style='min-width:100%;'> <tbody class='mcnDividerBlockOuter'> <tr> <td class='mcnDividerBlockInner' style='min-width: 100%; padding: 10px 18px;'> <table class='mcnDividerContent' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-top: 2px solid #EAEAEA;'> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table><!-- <td class='mcnDividerBlockInner' style='padding: 18px;'> <hr class='mcnDividerContent' style='border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;' />--> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowBlock' style='min-width:100%;'> <tbody class='mcnFollowBlockOuter'> <tr> <td align='center' valign='top' style='padding:9px' class='mcnFollowBlockInner'> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowContentContainer' style='min-width:100%;'> <tbody><tr> <td align='center' style='padding-left:9px;padding-right:9px;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width:100%;' class='mcnFollowContent'> <tbody><tr> <td align='center' valign='top' style='padding-top:9px; padding-right:9px; padding-left:9px;'> <table align='center' border='0' cellpadding='0' cellspacing='0'> <tbody><tr> <td align='center' valign='top'> <!--[if mso]> <table align='center' border='0' cellspacing='0' cellpadding='0'> <tr> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='http://www.facebook.com/lisaguru' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-facebook-96.png' alt='Facebook' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='http://www.lisaguru.com' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-link-96.png' alt='Website' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='https://www.youtube.com/user/lisagurutv' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-youtube-96.png' alt='YouTube' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='http://instagram.com/LISA_GURU' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-instagram-96.png' alt='Instagram' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:0; padding-bottom:9px;'> <a href='http://www.twitter.com/lisaguru' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-twitter-96.png' alt='Twitter' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr></tbody></table> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnDividerBlock' style='min-width:100%;'> <tbody class='mcnDividerBlockOuter'> <tr> <td class='mcnDividerBlockInner' style='min-width: 100%; padding: 10px 18px 25px;'> <table class='mcnDividerContent' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-top: 2px solid #EEEEEE;'> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table><!-- <td class='mcnDividerBlockInner' style='padding: 18px;'> <hr class='mcnDividerContent' style='border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;' />--> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnTextBlock' style='min-width:100%;'> <tbody class='mcnTextBlockOuter'> <tr> <td valign='top' class='mcnTextBlockInner' style='padding-top:9px;'> <!--[if mso]><table align='left' border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100%;'><tr><![endif]--> <!--[if mso]><td valign='top' width='600' style='width:600px;'><![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' style='max-width:100%; min-width:100%;' width='100%' class='mcnTextContentContainer'> <tbody><tr> <td valign='top' class='mcnTextContent' style='padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;'> <em>Copyright © 2017 Burda Thailand Co., Ltd All rights reserved.</em><br><br><strong>Our mailing address is:</strong><br><a href='mailto:infolisa@burda.co.th' target='_blank'>infolisa@burda.co.th</a><br><br>&nbsp; </td> </tr> </tbody></table><!--[if mso]></td><![endif]--> <!--[if mso]></tr></table><![endif]--> </td> </tr> </tbody></table></td> </tr> </table><!--[if gte mso 9]></td></tr></table><![endif]--> <!-- // END TEMPLATE --> </td> </tr> </table> </center> </body></html>"
                }
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.end(err);
                    } else {
                        res.json({ error: false, title: "Verification Email already sended", message: 'Please verify your email address' });
                        console.log("Message send: " + response.message);
                    }
                });
            } else {
                res.json({ error: true, title: "Faile to re-send the verification email", message: "please try again" });
            }
        }
    })
});

//verify email address from the user
router.get('/verify', function (req, res) {
    console.log(req.protocol + ':/' + req.get('host'));
    var db = User();
    var id;
    //if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
    console.log("Domain is matched. Information is form Authentic email");
    TempUser.findOne({ 'id': req.query.id }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result != null) {
                console.log('Found request');
                db.local['name'] = result.name;
                db.local['email'] = result.email;
                db.local['password'] = db.generateHash(result.password);
                db.isNewUser = true;
                id = result.id;
                if (req.query.id == id) {
                    db.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Save successfull');
                        }
                    });
                    TempUser.remove({ 'email': result.email }, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Remove tempuser already');
                        }
                    });
                    console.log("Email is verified");
                    res.render('verifyPage', { data: result.email });
                    //res.end("Email "+result.email+" is been Successfully verified");
                }
                else {
                    console.log("email is not verified");
                    res.render("oop", { data: "Bad requested." });
                }
            } else {
                res.render('oop', { data: "This email is already verified." });
            }
        }
    });
    //} else {
    //    res.end("<h1>Request is from unknown source</h1>");
    //}
});

/////////////forget password system//////////////////////////////////////
/*
    parameter : {
        email : String
    }
*/
router.post('/forgotPassword', function (req, res) {
    User.findOne({ 'local.email': req.body.email }, function (err, result) {
        if (err) {
            res.end(err);
        } else {
            if (result == null) {
                res.json({ success: false, message: 'This email is not existing in the system' })
            } else {
                var requestPass = new RequestNewPassword();
                var rand = uuid.v4();
                host = req.get('host');
                //link = "http://" + req.get('host') + "/api/requestNewPassword?id=" + rand;
                link = "https://horoscope.lisaguru.com/api/requestNewPassword?id="+rand;
                mailOptions = {
                    from: "Lisaguru <noreply@lisaguru.com>",
                    sender: "noreply@lisaguru.com",
                    replyTo: "noreply@lisaguru.com",
                    to: req.body.email,
                    subject: "Reset Password System",
                    html: "<!doctype html><html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><!-- NAME: 1 COLUMN --><!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta charset='UTF-8'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <meta name='viewport' content='width=device-width, initial-scale=1'><title>*|MC:SUBJECT|*</title> <style type='text/css'>p{margin:10px 0;padding:0;}table{border-collapse:collapse;}h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0;}img,a img{border:0;height:auto;outline:none;text-decoration:none;}body,#bodyTable,#bodyCell{height:100%;margin:0;padding:0;width:100%;}#outlook a{padding:0;}img{-ms-interpolation-mode:bicubic;}table{mso-table-lspace:0pt;mso-table-rspace:0pt;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}p,a,li,td,blockquote{mso-line-height-rule:exactly;}a[href^=tel],a[href^=sms]{color:inherit;cursor:default;text-decoration:none;}p,a,li,td,body,table,blockquote{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%;}a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important;}#bodyCell{padding:10px;}.templateContainer{max-width:600px !important;}a.mcnButton{display:block;}.mcnImage{vertical-align:bottom;}.mcnTextContent{word-break:break-word;}.mcnTextContent img{height:auto !important;}.mcnDividerBlock{table-layout:fixed !important;}/*@tab Page@section Background Style@tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.*/body,#bodyTable{/*@editable*/background-color:#FAFAFA;}/*@tab Page@section Background Style@tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.*/#bodyCell{/*@editable*/border-top:0;}/*@tab Page@section Email Border@tip Set the border for your email.*/.templateContainer{/*@editable*/border:0;}/*@tab Page@section Heading 1@tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.@style heading 1*/h1{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:26px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Page@section Heading 2@tip Set the styling for all second-level headings in your emails.@style heading 2*/h2{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:22px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Page@section Heading 3@tip Set the styling for all third-level headings in your emails.@style heading 3*/h3{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:20px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Page@section Heading 4@tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.@style heading 4*/h4{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:18px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Preheader@section Preheader Style@tip Set the background color and borders for your email's preheader area.*/#templatePreheader{/*@editable*/background-color:#FAFAFA;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:0;/*@editable*/padding-top:9px;/*@editable*/padding-bottom:9px;}/*@tab Preheader@section Preheader Text@tip Set the styling for your email's preheader text. Choose a size and color that is easy to read.*/#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{/*@editable*/color:#656565;/*@editable*/font-family:Helvetica;/*@editable*/font-size:12px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Preheader@section Preheader Link@tip Set the styling for your email's preheader links. Choose a color that helps them stand out from your text.*/#templatePreheader .mcnTextContent a,#templatePreheader .mcnTextContent p a{/*@editable*/color:#656565;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Header@section Header Style@tip Set the background color and borders for your email's header area.*/#templateHeader{/*@editable*/background-color:#FFFFFF;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:0;/*@editable*/padding-top:9px;/*@editable*/padding-bottom:0;}/*@tab Header@section Header Text@tip Set the styling for your email's header text. Choose a size and color that is easy to read.*/#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:16px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Header@section Header Link@tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.*/#templateHeader .mcnTextContent a,#templateHeader .mcnTextContent p a{/*@editable*/color:#2BAADF;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Body@section Body Style@tip Set the background color and borders for your email's body area.*/#templateBody{/*@editable*/background-color:#FFFFFF;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:2px solid #EAEAEA;/*@editable*/padding-top:0;/*@editable*/padding-bottom:9px;}/*@tab Body@section Body Text@tip Set the styling for your email's body text. Choose a size and color that is easy to read.*/#templateBody .mcnTextContent,#templateBody .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:16px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Body@section Body Link@tip Set the styling for your email's body links. Choose a color that helps them stand out from your text.*/#templateBody .mcnTextContent a,#templateBody .mcnTextContent p a{/*@editable*/color:#2BAADF;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Footer@section Footer Style@tip Set the background color and borders for your email's footer area.*/#templateFooter{/*@editable*/background-color:#FAFAFA;/*@editable*/background-image:none;/*@editable*/background-repeat:no-repeat;/*@editable*/background-position:center;/*@editable*/background-size:cover;/*@editable*/border-top:0;/*@editable*/border-bottom:0;/*@editable*/padding-top:9px;/*@editable*/padding-bottom:9px;}/*@tab Footer@section Footer Text@tip Set the styling for your email's footer text. Choose a size and color that is easy to read.*/#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{/*@editable*/color:#656565;/*@editable*/font-family:Helvetica;/*@editable*/font-size:12px;/*@editable*/line-height:150%;/*@editable*/text-align:center;}/*@tab Footer@section Footer Link@tip Set the styling for your email's footer links. Choose a color that helps them stand out from your text.*/#templateFooter .mcnTextContent a,#templateFooter .mcnTextContent p a{/*@editable*/color:#656565;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}@media only screen and (min-width:768px){.templateContainer{width:600px !important;}}@media only screen and (max-width: 480px){body,table,td,p,a,li,blockquote{-webkit-text-size-adjust:none !important;}}@media only screen and (max-width: 480px){body{width:100% !important;min-width:100% !important;}}@media only screen and (max-width: 480px){#bodyCell{padding-top:10px !important;}}@media only screen and (max-width: 480px){.mcnImage{width:100% !important;}}@media only screen and (max-width: 480px){.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer{max-width:100% !important;width:100% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer{min-width:100% !important;}}@media only screen and (max-width: 480px){.mcnImageGroupContent{padding:9px !important;}}@media only screen and (max-width: 480px){.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{padding-top:9px !important;}}@media only screen and (max-width: 480px){.mcnImageCardTopImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{padding-top:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardBottomImageContent{padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockInner{padding-top:0 !important;padding-bottom:0 !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockOuter{padding-top:9px !important;padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnTextContent,.mcnBoxedTextContentColumn{padding-right:18px !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{padding-right:18px !important;padding-bottom:0 !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcpreview-image-uploader{display:none !important;width:100% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 1@tip Make the first-level headings larger in size for better readability on small screens.*/h1{/*@editable*/font-size:22px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 2@tip Make the second-level headings larger in size for better readability on small screens.*/h2{/*@editable*/font-size:20px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 3@tip Make the third-level headings larger in size for better readability on small screens.*/h3{/*@editable*/font-size:18px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Heading 4@tip Make the fourth-level headings larger in size for better readability on small screens.*/h4{/*@editable*/font-size:16px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Boxed Text@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Visibility@tip Set the visibility of the email's preheader on small screens. You can hide it to save space.*/#templatePreheader{/*@editable*/display:block !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Text@tip Make the preheader text larger in size for better readability on small screens.*/#templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Header Text@tip Make the header text larger in size for better readability on small screens.*/#templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{/*@editable*/font-size:16px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Body Text@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/#templateBody .mcnTextContent,#templateBody .mcnTextContent p{/*@editable*/font-size:16px !important;/*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Footer Text@tip Make the footer content text larger in size for better readability on small screens.*/#templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:150% !important;}}</style></head> <body> <center> <table align='center' border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'> <tr> <td align='center' valign='top' id='bodyCell'> <!-- BEGIN TEMPLATE // --><!--[if gte mso 9]><table align='center' border='0' cellspacing='0' cellpadding='0' width='600' style='width:600px;'><tr><td align='center' valign='top' width='600' style='width:600px;'><![endif]--> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='templateContainer'> <tr> <td valign='top' id='templatePreheader'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnBoxedTextBlock' style='min-width:100%;'> <!--[if gte mso 9]><table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'><![endif]--><tbody class='mcnBoxedTextBlockOuter'> <tr> <td valign='top' class='mcnBoxedTextBlockInner'> <!--[if gte mso 9]><td align='center' valign='top' '><![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width:100%;' class='mcnBoxedTextContentContainer'> <tbody><tr> <td style='padding-top:9px; padding-left:18px; padding-bottom:9px; padding-right:18px;'> <table border='0' cellpadding='18' cellspacing='0' class='mcnTextContentContainer' width='100%' style='min-width: 100% !important;background-color: #EB008B;'> <tbody><tr> <td valign='top' class='mcnTextContent' style='color: #F2F2F2;font-family: Helvetica;font-size: 14px;font-weight: normal;text-align: center;'> <div style='text-align: center;'><img align='none' height='65' src='https://gallery.mailchimp.com/245cddd383d7409313b2b88d3/images/b01272b2-132a-4643-892a-c4b7b4ecbab7.png' style='width: 150px; height: 65px; margin: 0px;' width='150'></div> </td> </tr> </tbody></table> </td> </tr> </tbody></table><!--[if gte mso 9]></td><![endif]--> <!--[if gte mso 9]> </tr> </table><![endif]--> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateHeader'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnImageCardBlock'> <tbody class='mcnImageCardBlockOuter'> <tr> <td class='mcnImageCardBlockInner' valign='top' style='padding-top:9px; padding-right:18px; padding-bottom:9px; padding-left:18px;'> <table align='right' border='0' cellpadding='0' cellspacing='0' class='mcnImageCardBottomContent' width='100%'> <tbody><tr> <td class='mcnImageCardBottomImageContent' align='left' valign='top' style='padding-top:0px; padding-right:0px; padding-bottom:0; padding-left:0px;'> <img alt='' src='https://gallery.mailchimp.com/245cddd383d7409313b2b88d3/images/1ec73080-99e8-47dc-a941-e406015b5fd0.jpg' width='564' style='max-width:564px;' class='mcnImage'> </td> </tr> <tr> <td class='mcnTextContent' valign='top' style='padding: 9px 18px; font-family: Helvetica; font-size: 14px; font-weight: normal; text-align: center;' width='546'> <h1 class='null' style='text-align: left;'><span style='font-size:16px'><span style='line-height:26.4px'>Hello,<br>Please click the link below in order to reset your password.</span></span></h1> </td> </tr></tbody></table> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateBody'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnButtonBlock' style='min-width:100%;'> <tbody class='mcnButtonBlockOuter'> <tr> <td style='padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;' valign='top' align='center' class='mcnButtonBlockInner'> <table border='0' cellpadding='0' cellspacing='0' class='mcnButtonContentContainer' style='border-collapse: separate !important;border-radius: 5px;background-color: #E5007D;'> <tbody> <tr> <td align='center' valign='middle' class='mcnButtonContent' style='font-family: Arial; font-size: 16px; padding: 15px;'> <a class='mcnButton ' title='Click here to reset password' href='" + link + "' target='_blank' style='font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;'>Click here to reset password</a> </td> </tr> </tbody> </table> </td> </tr> </tbody></table></td> </tr> <tr> <td valign='top' id='templateFooter'><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnDividerBlock' style='min-width:100%;'> <tbody class='mcnDividerBlockOuter'> <tr> <td class='mcnDividerBlockInner' style='min-width: 100%; padding: 10px 18px;'> <table class='mcnDividerContent' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-top: 2px solid #EAEAEA;'> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table><!-- <td class='mcnDividerBlockInner' style='padding: 18px;'> <hr class='mcnDividerContent' style='border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;' />--> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowBlock' style='min-width:100%;'> <tbody class='mcnFollowBlockOuter'> <tr> <td align='center' valign='top' style='padding:9px' class='mcnFollowBlockInner'> <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnFollowContentContainer' style='min-width:100%;'> <tbody><tr> <td align='center' style='padding-left:9px;padding-right:9px;'> <table border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width:100%;' class='mcnFollowContent'> <tbody><tr> <td align='center' valign='top' style='padding-top:9px; padding-right:9px; padding-left:9px;'> <table align='center' border='0' cellpadding='0' cellspacing='0'> <tbody><tr> <td align='center' valign='top'> <!--[if mso]> <table align='center' border='0' cellspacing='0' cellpadding='0'> <tr> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='http://www.facebook.com/lisaguru' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-facebook-96.png' alt='Facebook' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='http://www.lisaguru.com' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-link-96.png' alt='Website' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='https://www.youtube.com/user/lisagurutv' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-youtube-96.png' alt='YouTube' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:10px; padding-bottom:9px;'> <a href='http://instagram.com/LISA_GURU' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-instagram-96.png' alt='Instagram' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> <td align='center' valign='top'> <![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' class='mcnFollowStacked' style='display:inline;'> <tbody><tr> <td align='center' valign='top' class='mcnFollowIconContent' style='padding-right:0; padding-bottom:9px;'> <a href='http://www.twitter.com/lisaguru' target='_blank'><img src='https://cdn-images.mailchimp.com/icons/social-block-v2/color-twitter-96.png' alt='Twitter' class='mcnFollowBlockIcon' width='48' style='width:48px; max-width:48px; display:block;'></a> </td> </tr> </tbody></table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody></table> </td> </tr> </tbody></table> </td> </tr></tbody></table> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnDividerBlock' style='min-width:100%;'> <tbody class='mcnDividerBlockOuter'> <tr> <td class='mcnDividerBlockInner' style='min-width: 100%; padding: 10px 18px 25px;'> <table class='mcnDividerContent' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-top: 2px solid #EEEEEE;'> <tbody><tr> <td> <span></span> </td> </tr> </tbody></table><!-- <td class='mcnDividerBlockInner' style='padding: 18px;'> <hr class='mcnDividerContent' style='border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;' />--> </td> </tr> </tbody></table><table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnTextBlock' style='min-width:100%;'> <tbody class='mcnTextBlockOuter'> <tr> <td valign='top' class='mcnTextBlockInner' style='padding-top:9px;'> <!--[if mso]><table align='left' border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100%;'><tr><![endif]--> <!--[if mso]><td valign='top' width='600' style='width:600px;'><![endif]--> <table align='left' border='0' cellpadding='0' cellspacing='0' style='max-width:100%; min-width:100%;' width='100%' class='mcnTextContentContainer'> <tbody><tr> <td valign='top' class='mcnTextContent' style='padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;'> <em>Copyright © 2017 Burda Thailand Co., Ltd All rights reserved.</em><br><br><strong>Our mailing address is:</strong><br><a href='mailto:infolisa@burda.co.th' target='_blank'>infolisa@burda.co.th</a><br><br>&nbsp; </td> </tr> </tbody></table><!--[if mso]></td><![endif]--> <!--[if mso]></tr></table><![endif]--> </td> </tr> </tbody></table></td> </tr> </table><!--[if gte mso 9]></td></tr></table><![endif]--> <!-- // END TEMPLATE --> </td> </tr> </table> </center> </body></html>"
                }
                console.log(mailOptions);
                requestPass.id = rand;
                requestPass.email = req.body.email;
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.end(error);
                    } else {
                        requestPass.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.end(err);
                            }
                            else {
                                console.log("Making a new request to request new password");
                                console.log('Wait...... for response from email');
                                res.json({ success: true, message: 'Please check your email address to continue.' })
                            }
                        });
                        console.log("Message sent: " + response.message);
                    }
                });
            }
        }
    })
});

//request password 
router.get('/requestNewPassword', function (req, res) {

    //console.log(req.protocol + ':/' + req.get('host'));
    //if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        //looking for request in database which one is match the id with the link
        RequestNewPassword.findOne({ 'id': req.query.id }, function (err, result) {
            if (err) {
                console.log(err);
            } else if (result != null) {
                if (result.id == req.query.id) {
                    res.render('resetPassword', { 'email': result.email });
                } else {
                    //res.end("Already done");
                    res.render('already', { data: "You have successfully changed your password previously." })
                }
            } else {
                //res.end("Already done");
                res.render('already', { data: "You have successfully changed your password previously." })
            }
        })
   // } else {
   //     console.log("Already expired!");
        //res.end("Already expired!");
   //     res.render('oop', { data: "This link is already expired. Please try to reset your password again." })
   // }
});
//update password 
router.post('/updatePassword', function (req, res) {
    var db = new User();
    console.log(req.body.email);
    var password = db.generateHash(req.body.password); // encode password 
    User.findOne({ 'local.email': req.body.email }, function (err, result) {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            //update password and hash password tobe encode
            console.log(result);
            if (result == null) {
                //res.end("This email is not existed in the system");
                res.render('oop', { data: "This email is not existed in the system" });
            }
            else {
                result.update({
                    "local.password": password // update password
                }, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.end(err);
                    } else {
                        console.log('Update password successfully');
                        RequestNewPassword.remove({ 'email': req.body.email }, function (req, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Remove request')
                            }
                        });
                        res.end('Changed');
                    }
                });
            }
        }
    })
    res.render('changePass');
});

////////////////////////Log in system ///////////////////////////////////
/*
    parameter:{
        username: String,
        password : String,
    }
    output :{
        if success
            return token
        else
            return not thing
    }
*/
router.post('/login', function (req, res) {
    var session = new Session();
    User.findOne({ 'local.email': req.body.email }, function (err, user) {
        if (err) throw err;
        if (!user) {
            //user not found
            TempUser.findOne({ 'email': req.body.email }, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (!result) {
                        res.json({ success: false, message: 'Authentication failed; email or password is incorrect. Try again.' });
                    }
                    else {
                        res.json({
                            option: true, email: result.email, message: 'Please verify your email address by clicking the link in the confirmation email that we sent to ' + result.email
                        });
                    }
                }
            })
            //res.json({ success: false, message: 'Authentication failed, email or password is incorrect.' });
        }
        else {
            //user found 
            if (!user.validPassword(req.body.password)) {
                res.json({ success: false, message: 'Authentication failed; email or password is incorrect. Try again.' });
            }
            else {
                //log in successfull
                //create token for that User
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 60 * 60 * 12
                });
                console.log('Login with email');
                session["type"] = "email";
                session['token'] = token;
                session['email'] = user.local.email;
                session['name'] = user.local.name;
                session['birthday'] = user.birthday;
                session['sign'] = user.sign;

                //create session for that user
                session.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.end(err);
                    } else {
                        console.log("Login successfully");
                    }
                });
                if (user.isNewUser === true) {
                    User.findOne({ 'local.email': req.body.email }, function (err, userupdate) {
                        if (err) {
                            console.log(err);
                        } else {
                            userupdate.update({ 'isNewUser': false }, function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('update done');
                                }
                            })
                        }
                    })
                    res.json({
                        success: true,
                        token: token,
                        isNewUser: true
                    })
                } else {
                    res.json({
                        success: true,
                        token: token,
                        isNewUser: false
                    });
                }
            }
        }
    });
});

/////////////////// Log out  create blacklist /////////////////////
// POST METHOD //
// send token long with the req.body //
/*
    Parameter:{
        token : String
    }

*/
router.post('/logout', function (req, res) {
    var token = req.body.token;
    var response = {};
    //find token is it in the blacklist or not
    Session.remove({ 'token': token }, function (err, result) {
        if (err) {
            console.log(err);
            response = err;
            res.json(response);
        } else {
            response = { "success": "true", "message": "Logout Successfully" };
            console.log('Remove Session');
            res.json(response);
        }
    });
})
////////////////////////Log in with facebook ///////////////////////////////////

router.post('/loginfb', function (req, res) {
    var db = new User();
    var session = new Session();
    var isNewUser = false;
    var response = {};
    session["type"] = "facebook";
    session["email"] = req.body.email;
    session["name"] = req.body.name;
    session["picture"] = req.body.picture.data.url;

    db.facebook['id'] = req.body.id;
    db.facebook['email'] = req.body.email;
    db.facebook['name'] = req.body.name;
    db.facebook['picture'] = req.body.picture.data.url;

    //check for existing email in the system
    User.findOne({ 'facebook.email': req.body.email }, function (err, result) {
        if (err) {
            response = { "success": false, "message": err.message() };
            console.log(err);
            res.json(response);
        } else {
            if (result == null) {
                //first time login save to user database 

                db.save(function (err) {
                    if (err) {
                        console.log("Error in Saving to database");
                    } else {
                        console.log("Saving to database");
                        isNewUser = true;
                    }
                });
                var token = jwt.sign(db, config.secret, {
                    expiresIn: 60 * 60 * 12
                });
            } else {
                isNewUser = false;
                var token = jwt.sign(result, config.secret, {
                    expiresIn: 60 * 60 * 12
                });
                session["birthday"] = result.birthday;
                session["sign"] = result.sign;
            }
            console.log("Already in the system");
            session["token"] = token;

            session.save(function (err) {
                if (err) {
                    response = { "success": false, "message": "Error in creating session" };
                    res.json(response);
                } else {
                    response = { "success": true, "token": token, "isNewUser": isNewUser };
                    res.json(response);
                }
            });


        }
    });
});

/////////////////////////////////////////// Horoscope Zodiac //////////////////////////////////////////////
router.get("/horoscope/:sign", function (req, res) {
    var resp = {};
    var id;
    if (req.params.sign == 'aries') {
        id = 18286;
    }
    else if (req.params.sign == 'taurus') {
        id = 18288;
    }
    else if (req.params.sign == 'gemini') {
        id = 18289;
    }
    else if (req.params.sign == 'cancer') {
        id = 18290;
    }
    else if (req.params.sign == 'leo') {
        id = 18291;
    }
    else if (req.params.sign == 'virgo') {
        id = 18292;
    }
    else if (req.params.sign == 'libra') {
        id = 18293;
    }
    else if (req.params.sign == 'scorpio') {
        id = 18294;
    }
    else if (req.params.sign == 'sagittarius') {
        id = 18295;
    }
    else if (req.params.sign == 'capricorn') {
        id = 18297;
    }
    else if (req.params.sign == 'aquarius') {
        id = 18298;
    }
    else if (req.params.sign == 'pisces') {
        id = 18299;
    }

    request.get('https://lisaguru.com/api/get_post/?id=' + id, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body); //parse string to json 
            var wholecontent = info.post['content'];
            var temp = wholecontent.split('</aside>'); //remove share content 
            var content = temp[1].split('-->'); // remove comment   tags
            var content = content[1]; //content
            var content = content.split('\n'); // separate each cat by enter
            if(content.length == 13){
                var title = content[0].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from title
                var work = content[2].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from work
                var finance = content[4].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from finance
                var love = content[6].replace(/<\/?[^>]+(>|$)/g, "");// remove html tag from love
                var healthy = content[9].replace(/<\/?[^>]+(>|$)/g, ""); //remove html tag from healthy
                var luck = content[11].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from luck
            }else {
                var title = content[0].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from title
                var work = content[3].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from work
                var finance = content[5].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from finance
                var love = content[7].replace(/<\/?[^>]+(>|$)/g, "");// remove html tag from love
                var healthy = content[10].replace(/<\/?[^>]+(>|$)/g, ""); //remove html tag from healthy
                var luck = content[12].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from luck
            }
            resp = {
                "title": title,
                "work": work,
                "finance": finance,
                "love": love,
                "healthy": healthy,
                "luck": luck
            }
            res.json(resp);
        } else {
            res.json({ error: true, message: 'Something went wrong, Please try again' });
        }
    });
});

module.exports = router;
