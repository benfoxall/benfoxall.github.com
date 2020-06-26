<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:atom="http://www.w3.org/2005/Atom" exclude-result-prefixes="atom">

  <xsl:output method="html"/>

  <xsl:template match="atom:feed">
    <html>
      <head>
        <title>&lt;Atom Feed&gt;</title>
        <link rel="stylesheet" href="atom.css"/>
        <script src="atom.js" defer="defer" type="module"></script>
      </head>
      <body>
        <header>yup, this is xml</header>
        <h1>
          <a href="/">/</a>
          <xsl:value-of select="atom:title"/>
        </h1>
        <ul>
          <xsl:apply-templates select="atom:entry" />
        </ul>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="atom:entry">
    <li>
      <a href="{atom:link/@href}">
        <xsl:value-of select="atom:title"/>
      </a>
      <time datetime="{atom:updated}">
        <xsl:value-of select="atom:updated"/>
      </time>
    </li>
  </xsl:template>

</xsl:stylesheet>
