import Shopify from '@shopify/shopify-api';

const accessToken = "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";
const client = new Shopify.Clients.Rest('tulsani.myshopify.com', accessToken);
const data = await client.get({
  path: 'script_tags',
});

console.log(data);
88113a3d-f8cd-4084-ba09-a67036c96db2



<!doctype html>
<html class="no-js full-height" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="">
    <link rel="canonical" href="{{ canonical_url }}">
    <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>

    {%- if settings.favicon != blank -%}
      <link rel="icon" type="image/png" href="{{ settings.favicon | img_url: '32x32' }}">
    {%- endif -%}

    {%- unless settings.type_header_font.system? -%}
      <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>
    {%- endunless -%}

    <title>{{ shop.name }}</title>

    <meta name="description" content="{{ page_description | escape }}">

    {% render 'meta-tags' %}

    {{ content_for_header }}

    {%- liquid
      assign body_font_bold = settings.type_body_font | font_modify: 'weight', 'bold'
      assign body_font_italic = settings.type_body_font | font_modify: 'style', 'italic'
      assign body_font_bold_italic = body_font_bold | font_modify: 'style', 'italic'
    %}

    {% style %}
      {{ settings.type_body_font | font_face: font_display: 'swap' }}
      {{ body_font_bold | font_face: font_display: 'swap' }}
      {{ body_font_italic | font_face: font_display: 'swap' }}
      {{ body_font_bold_italic | font_face: font_display: 'swap' }}
      {{ settings.type_header_font | font_face: font_display: 'swap' }}

      :root {
        --font-body-family: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
        --font-body-style: {{ settings.type_body_font.style }};
        --font-body-weight: {{ settings.type_body_font.weight }};

        --font-heading-family: {{ settings.type_header_font.family }}, {{ settings.type_header_font.fallback_families }};
        --font-heading-style: {{ settings.type_header_font.style }};
        --font-heading-weight: {{ settings.type_header_font.weight }};

        --font-body-scale: {{ settings.body_scale | divided_by: 100.0 }};
        --font-heading-scale: {{ settings.heading_scale | times: 1.0 | divided_by: settings.body_scale }};

        --color-base-text: {{ settings.colors_text.red }}, {{ settings.colors_text.green }}, {{ settings.colors_text.blue }};
        --color-base-background-1: {{ settings.colors_background_1.red }}, {{ settings.colors_background_1.green }}, {{ settings.colors_background_1.blue }};
        --color-base-background-2: {{ settings.colors_background_2.red }}, {{ settings.colors_background_2.green }}, {{ settings.colors_background_2.blue }};
        --color-base-solid-button-labels: {{ settings.colors_solid_button_labels.red }}, {{ settings.colors_solid_button_labels.green }}, {{ settings.colors_solid_button_labels.blue }};
        --color-base-outline-button-labels: {{ settings.colors_outline_button_labels.red }}, {{ settings.colors_outline_button_labels.green }}, {{ settings.colors_outline_button_labels.blue }};
        --color-base-accent-1: {{ settings.colors_accent_1.red }}, {{ settings.colors_accent_1.green }}, {{ settings.colors_accent_1.blue }};
        --color-base-accent-2: {{ settings.colors_accent_2.red }}, {{ settings.colors_accent_2.green }}, {{ settings.colors_accent_2.blue }};
        --payment-terms-background-color: {{ settings.colors_background_1 }};

        --gradient-base-background-1: {% if settings.gradient_background_1 != blank %}{{ settings.gradient_background_1 }}{% else %}{{ settings.colors_background_1 }}{% endif %};
        --gradient-base-background-2: {% if settings.gradient_background_2 != blank %}{{ settings.gradient_background_2 }}{% else %}{{ settings.colors_background_2 }}{% endif %};
        --gradient-base-accent-1: {% if settings.gradient_accent_1 != blank %}{{ settings.gradient_accent_1 }}{% else %}{{ settings.colors_accent_1 }}{% endif %};
        --gradient-base-accent-2: {% if settings.gradient_accent_2 != blank %}{{ settings.gradient_accent_2 }}{% else %}{{ settings.colors_accent_2 }}{% endif %};

        --page-width: {{ settings.page_width | divided_by: 10 }}rem;
        --page-width-margin: {% if settings.page_width == '1600' %}2{% else %}0{% endif %}rem;
      }
    {% endstyle %}

    {%- unless settings.type_body_font.system? -%}
      <link rel="preload" as="font" href="{{ settings.type_body_font | font_url }}" type="font/woff2" crossorigin>
    {%- endunless -%}
    {%- unless settings.type_header_font.system? -%}
      <link rel="preload" as="font" href="{{ settings.type_header_font | font_url }}" type="font/woff2" crossorigin>
    {%- endunless -%}

    {{ 'section-password.css' | asset_url | stylesheet_tag }}
    {{ 'base.css' | asset_url | stylesheet_tag }}
    {{ 'component-list-social.css' | asset_url | stylesheet_tag }}

    <script>document.documentElement.className = document.documentElement.className.replace('no-js', 'js');</script>
    <script src="{{ 'global.js' | asset_url }}" defer="defer"></script>
    <script src="{{ 'details-modal.js' | asset_url }}" defer="defer"></script>
    <script src="{{ 'password-modal.js' | asset_url }}" defer="defer"></script>
  </head>

  <body class="password gradient">
    <a class="skip-to-content-link button visually-hidden" href="#MainContent">
      {{ 'accessibility.skip_to_text' | t }}
    </a>

    {% section 'main-password-header' %}

    <main id="MainContent" class="password-main">
      {{ content_for_layout }}
    </main>
    <footer>
      {% section 'main-password-footer' %}
    </footer>
  </body>
</html>
