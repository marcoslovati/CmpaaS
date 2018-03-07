import { Component, OnInit } from '@angular/core';
import { myDiagram } from '../../editors/conceptmap/conceptmap.component'; 
import * as go from "gojs";

declare const $: any;
declare const swal: any;

const md: any = {
    misc: {
        navbar_menu_visible: 0,
        active_collapse: true,
        disabled_collapse_init: 0,
    }
};

@Component({
  selector: 'app-formattoolsplugin',
  templateUrl: './formattoolsplugin.component.html',
  styleUrls: ['./formattoolsplugin.component.css']
})

export class FormatToolsPluginComponent implements OnInit {
  constructor() { }

  ngOnInit() {
      // fixed plugin
      const $sidebar = $('.sidebar');
      const $sidebar_img_container = $sidebar.find('.sidebar-background');
      //
      const $full_page = $('.full-page');
      //
      const $sidebar_responsive = $('body > .navbar-collapse');
      const window_width = $(window).width();

      const fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();

      if ( window_width > 767 && fixed_plugin_open === 'Dashboard' ) {
          if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
              $('.fixed-plugin .dropdown').addClass('open');
          }

      }

      $('.fixed-plugin a').click(function(event) {
        // Alex: if we click on switch, stop propagation of the event,
        // so the dropdown will not be hide, otherwise we set the  section active
          if ($(this).hasClass('switch-trigger')) {
              if (event.stopPropagation) {
                  event.stopPropagation();
              } else if (window.event) {
                 window.event.cancelBubble = true;
              }
          }
      });

      $('.fixed-plugin .stroke-color span').click(function() {
         
            const color = $(this).data('color');
            // Always make changes in a transaction, except when initializing the diagram.
            myDiagram.startTransaction("change color");
            myDiagram.selection.each(function(node) {
            if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
                // Examine and modify the data, not the Node directly.
                var data = node.data;
                // Call setDataProperty to support undo/redo as well as
                // automatically evaluating any relevant bindings.
                myDiagram.model.setDataProperty(data, "color", color);
            }
            });
            myDiagram.commitTransaction("change color");

      });
      $('#stroke-color-input').on('change', function() { 
            // Always make changes in a transaction, except when initializing the diagram.
            myDiagram.startTransaction("change color");
            myDiagram.selection.each(function(node) {
            if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
                // Examine and modify the data, not the Node directly.
                var data = node.data;
                // Call setDataProperty to support undo/redo as well as
                // automatically evaluating any relevant bindings.
                myDiagram.model.setDataProperty(data, "color", $('#stroke-color-input').val());
            }
            });
            myDiagram.commitTransaction("change color");
      } );

      $('.fixed-plugin .border-color span').click(function() {
         
            const color = $(this).data('color');
            // Always make changes in a transaction, except when initializing the diagram.
            myDiagram.startTransaction("change color");
            myDiagram.selection.each(function(node) {
            if (node instanceof go.Node || node instanceof go.Link) {  // ignore any selected Links and simple Parts
                // Examine and modify the data, not the Node directly.
                var data = node.data;
                // Call setDataProperty to support undo/redo as well as
                // automatically evaluating any relevant bindings.
                myDiagram.model.setDataProperty(data, "border-color", color);
            }
            });
            myDiagram.commitTransaction("change color");

      });

      $('#border-color-input').on('change', function() { 
            // Always make changes in a transaction, except when initializing the diagram.
            myDiagram.startTransaction("change border-color");
            myDiagram.selection.each(function(node) {
            if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
                // Examine and modify the data, not the Node directly.
                var data = node.data;
                // Call setDataProperty to support undo/redo as well as
                // automatically evaluating any relevant bindings.
                myDiagram.model.setDataProperty(data, "border-color", $('#border-color-input').val());
            }
            });
            myDiagram.commitTransaction("change border-color");
      } );

      $('.fixed-plugin .text-color span').click(function() {
         
            const color = $(this).data('color');
            // Always make changes in a transaction, except when initializing the diagram.
            myDiagram.startTransaction("change color");
            myDiagram.selection.each(function(node) {
            if (node instanceof go.Node || node instanceof go.Link) {  // ignore any selected Links and simple Parts
                // Examine and modify the data, not the Node directly.
                var data = node.data;
                // Call setDataProperty to support undo/redo as well as
                // automatically evaluating any relevant bindings.
                myDiagram.model.setDataProperty(data, "text-color", color);
            }
            });
            myDiagram.commitTransaction("change color");

      });

      $('#text-color-input').on('change', function() { 
            // Always make changes in a transaction, except when initializing the diagram.
            myDiagram.startTransaction("change text-color");
            myDiagram.selection.each(function(node) {
            if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
                // Examine and modify the data, not the Node directly.
                var data = node.data;
                // Call setDataProperty to support undo/redo as well as
                // automatically evaluating any relevant bindings.
                myDiagram.model.setDataProperty(data, "text-color", $('#text-color-input').val());
            }
            });
            myDiagram.commitTransaction("change text-color");
      } );

      $('#bt-save').click(() => {
          //alert(myDiagram.model.toJson());
          swal({
                    html: '<div class="col-md-12">'+
                            '<div class="card">'+
                                '<form method="get" action="/" class="form-horizontal">'+
                                    '<div class="card-header" data-background-color="orange">'+
                                        '<small><h6 class="card-title">Map Informations</h6></small>'+
                                    '</div>'+
                                    '<div class="card-content">'+
                                        '<div class="row">'+
                                            '<label class="col-md-3 label-on-left">Title</label>'+
                                            '<div class="col-md-9">'+
                                                '<div class="form-group label-floating is-empty">'+
                                                    '<label class="control-label"></label>'+
                                                    '<input type="text" class="form-control" value id="map-title">'+
                                                    '<span class="help-block">A title will help you to find this map in the future.</span>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="row">'+
                                            '<label class="col-md-3 label-on-left">Description</label>'+
                                            '<div class="col-md-9">'+
                                                '<div class="form-group label-floating is-empty">'+
                                                    '<label class="control-label"></label>'+
                                                    '<input id="map-description" type="text" class="form-control" value>'+
                                                    '<span class="help-block">Give some more informations about this map.</span>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="row">'+
                                            '<label class="col-md-3 label-on-left">Investigation Question</label>'+
                                            '<div class="col-md-9">'+
                                                '<div class="form-group label-floating is-empty">'+
                                                    '<label class="control-label"></label>'+
                                                    '<input id="map-question" type="text" class="form-control" value>'+
                                                    '<span class="help-block">A question that this map aims to answer.</span>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="row">'+
                                            '<label class="col-md-3 label-on-left">Keywords</label>'+
                                            '<div class="col-md-9">'+
                                                '<div class="form-group label-floating is-empty">'+
                                                    '<label class="control-label"></label>'+
                                                    '<input id="map-keywords" type="text" class="form-control" value>'+
                                                    '<span class="help-block">Separeted y comma. Used to find this map.</span>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="row">'+
                                            '<label class="col-md-3 label-on-left">Access Level</label>'+
                                            '<div class="col-md-9">'+
                                                '<div class="radio checkbox-inline">'+
                                                    '<label>'+
                                                        '<input id="map-public" type="radio" name="optionsRadios" checked="true"> Public'+
                                                    '</label>'+
                                                '</div>'+
                                                '<div class="radio checkbox-inline">'+
                                                    '<label>'+
                                                        '<input type="radio" name="optionsRadios"> Groups'+
                                                    '</label>'+
                                                '</div>'+
                                                '<div class="radio checkbox-inline">'+
                                                    '<label>'+
                                                        '<input type="radio" name="optionsRadios"> Private'+
                                                    '</label>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</form>'+
                            '</div>'+
                        '</div>',
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: false
                }).then(function(result) {
                    let map:Object = {
                        title: $('#map-title').val(),
                        description: $('#map-description').val(),
                        question: $('#map-question').val(),
                        keywords: [].concat(($('#map-keywords').val()).replace(/ /g,'').split(",")),
                        isPublic: $('#map-public').prop('checked')
                    };

                    console.log(JSON.stringify(map));

                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url: 'http://localhost:3000/v1/maps',
                        headers: {
                            "X-Access-Token": localStorage.getItem('token')
                        },
                        data: (JSON.stringify(map)).toString()
                    }).done(function(res) { 
                        // swal({
                        //     type: 'success',
                        //     html: 'Result: <strong>' +
                        //             res.userMessage +
                        //         '</strong>',
                        //     confirmButtonClass: 'btn btn-success',
                        //     buttonsStyling: false

                        // });
                        let obj = {
                            map: res.map,
                            content: JSON.parse(myDiagram.model.toJson())
                        };
                        
                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json',
                            url: 'http://localhost:3000/v1/mapContent',
                            headers: {
                                "X-Access-Token": localStorage.getItem('token')
                            },
                            data: JSON.stringify(obj)
                        }).done(function(response) { 
                            swal({
                                type: 'success',
                                html: 'Result: <strong>' +
                                        response.userMessage +
                                    '</strong>',
                                confirmButtonClass: 'btn btn-success',
                                buttonsStyling: false

                            });
                        }).catch(function(error) {
                            console.log(error);
                            swal({
                                type: 'error',
                                html: 'Error: <strong>' +
                                        JSON.parse(error.responseText).userMessage +
                                    '</strong>',
                                confirmButtonClass: 'btn btn-error',
                                buttonsStyling: false

                            });
                        });
                    }).catch(function(error) {
                        console.log(error);
                        swal({
                            type: 'error',
                            html: 'Error: <strong>' +
                                    JSON.parse(error.responseText).userMessage +
                                '</strong>',
                            confirmButtonClass: 'btn btn-error',
                            buttonsStyling: false

                        });
                    });
                    
                    
                }).catch(swal.noop);
      });

      $('.fixed-plugin .background-color span').click(function() {
          $(this).siblings().removeClass('active');
          $(this).addClass('active');
          const new_color = $(this).data('color');

          if ($sidebar.length !== 0) {
              $sidebar.attr('data-background-color', new_color);
          }
      });

      $('.fixed-plugin .img-holder').click(function() {
          const $full_page_background = $('.full-page-background');

          $(this).parent('li').siblings().removeClass('active');
          $(this).parent('li').addClass('active');

          let new_image = $(this).find('img').attr('src');

          if ( $sidebar_img_container.length !== 0 && $('.switch-sidebar-image input:checked').length !== 0 ) {
              $sidebar_img_container.fadeOut('fast', function() {
                 $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
                 $sidebar_img_container.fadeIn('fast');
              });
          }

          if ($full_page_background.length !== 0 && $('.switch-sidebar-image input:checked').length !== 0 ) {
              const new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

              $full_page_background.fadeOut('fast', function(){
                 $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
                 $full_page_background.fadeIn('fast');
              });
          }

          if ( $('.switch-sidebar-image input:checked').length === 0 ) {
              new_image = $('.fixed-plugin li.active .img-holder').find('img').attr('src');
              const new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

              $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
              $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
          }

          if ($sidebar_responsive.length !== 0) {
              $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
          }
      });

      $('.switch-sidebar-image input').change(function() {
          const $full_page_background = $('.full-page-background');
          const $input = $(this);

          if ($input.is(':checked')) {
              if ($sidebar_img_container.length !== 0) {
                  $sidebar_img_container.fadeIn('fast');
                  $sidebar.attr('data-image', '#');
              }

              if ($full_page_background.length !== 0) {
                  $full_page_background.fadeIn('fast');
                  $full_page.attr('data-image', '#');
              }

              const background_image = true;
          } else {
              if ($sidebar_img_container.length !== 0) {
                  $sidebar.removeAttr('data-image');
                  $sidebar_img_container.fadeOut('fast');
              }

              if ($full_page_background.length !== 0) {
                  $full_page.removeAttr('data-image', '#');
                  $full_page_background.fadeOut('fast');
              }

              const background_image = false;
          }
      });

      $('.switch-sidebar-mini input').change(function(){
          const $body = $('body');

          const $input = $(this);

          if (md.misc.sidebar_mini_active === true) {
              $('body').removeClass('sidebar-mini');
              md.misc.sidebar_mini_active = false;

          } else {
              setTimeout(function(){
                  $('body').addClass('sidebar-mini');

                  $('.sidebar .collapse').css('height', 'auto');
                  md.misc.sidebar_mini_active = true;
              }, 300);
          }

          // we simulate the window Resize so the charts will get updated in realtime.
          const simulateWindowResize = setInterval(function(){
              window.dispatchEvent(new Event('resize'));
          }, 180);

          // we stop the simulation of Window Resize after the animations are completed
          setTimeout(function(){
              clearInterval(simulateWindowResize);
          }, 1000);

      });
  }

}
