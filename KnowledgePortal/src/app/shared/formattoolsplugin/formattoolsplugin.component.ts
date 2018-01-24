import { Component, OnInit } from '@angular/core';
import { myDiagram } from '../../editors/conceptmap/conceptmap.component'; 
import * as go from "gojs";


declare const $: any;
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
            if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
                // Examine and modify the data, not the Node directly.
                var data = node.data;
                // Call setDataProperty to support undo/redo as well as
                // automatically evaluating any relevant bindings.
                myDiagram.model.setDataProperty(data, "border-color", color);
            }
            });
            myDiagram.commitTransaction("change color");

      });

      $('.fixed-plugin .text-color span').click(function() {
         
            const color = $(this).data('color');
            // Always make changes in a transaction, except when initializing the diagram.
            myDiagram.startTransaction("change color");
            myDiagram.selection.each(function(node) {
            if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
                // Examine and modify the data, not the Node directly.
                var data = node.data;
                // Call setDataProperty to support undo/redo as well as
                // automatically evaluating any relevant bindings.
                myDiagram.model.setDataProperty(data, "text-color", color);
            }
            });
            myDiagram.commitTransaction("change color");

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
