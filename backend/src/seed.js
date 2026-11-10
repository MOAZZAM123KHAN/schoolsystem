const User = require("./models/User");
const Settings = require("./models/Settings");
const Student = require("./models/Student");

const DEFAULT_LOGO =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAQDAwMDAgQDAwMEBAQFBgoGBgUFBgwICQcKDgwPDg4MDQ0PERYTDxAVEQ0NExoTFRcYGRkZDxIbHRsYHRYYGRj/2wBDAQQEBAYFBgsGBgsYEA0QGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBj/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7+ooooAKKKKTAQikI4pc0hYAc1m0gCkOAMmmlx3IAHc1xvin4k+E/C8Ek2oatDvTjyw3OalU2+gudHYyFDGQysR9Kqyk26B9kUa/3mbFfJfjD9sCKfWpNG8LWEksyyeUCO5rzrWvGHx91zS5dWma4t9N3dQSABn61apN9CJVUj7suvEOlWiZuNasICP70wFZj/EHwVbxH7R4qsAe4My18S3Pwj+IfiLwHD4svPFU6W0gzgSnj9ax/hX8Jrn4malq2nHxBcLJpgzKxcnPX/Ct4UWjP26eh9123j/whdy7LDxRp8jE4CtMuCfSukttUsZ7cEXtpIf8ApnJkV+ani/4eXfhbXrKws/EFx/pMojBSQgqTXoFx8NPi34X0Q3ek+KLqYxwiba8pPGM+tazpuxCqq9z7zS6+Qv5EhX1UZzSo9vMNxRl/3+K/N7wt+1T8V/D2sf2bqzrc28MmyQFctx719J+Cv2sPDGrwyaf4itXsLyPaMvwG3dD0rm5H2NlVR9KqCG+U/Ljin1z3h3xVo+v6Ytxpl/FcAjhVYZrYS5R+OVb+6adrblKV9iwOtLTEyRkjHtT6CkFHeiigYUUnelpJgFFFFMAooooAKQ5yBjil701nCkCkwFJycVk6xremaNYzXl/fRRLEpYhmxWX428caR4I8EXPiHWLlIYkU7FY4LHsP0r82vi3+0BrfjbXLs6ReTR2RbaUDHkZqoU+ZmNWpZWR7f8V/2pPEF7q0nh3wXGd8jeWsiZwa8Y8K2WreKvjtp/hz4n6jdWJumD7mOA2eQOa9i+B/grwN45+FUWp6bcxHxHbEPIrnLAj611fxj8D6RPpfhn4hQXNs8uizqt+0RAYgEADj0wa9GNC0b3OB1bM83+N/wUuPhf4nPivwXNJcW6MJXjxkp7HFdZLqnxA1P9lZjFHvkuAWwRyOc0fF39pLQLG5lt7KCPUbXUUBVSM7eMf0rxq4/aB8Y3ehJpFhHDbWKk4TYBwaIx5VqZTqXeh7f8M9W1LVv2Xrrw7qCxNqsDnajMcjisn9nWWbwP8AFHxHpeu+RAL6EYYtj+E/418vHxb4lsNau7qLVJoftBJEaOQKp3HiPU7nWPtkurXIuiuNyyEdqemzJjCUtYnvnxL0y/h+MWiXKtbyab9tUuysTtWvoLVPFnh3VPD+oN4evIp7i1sgHiDZ6Jz/ACr8/wBde1K+AjudUuZJYm3LukNaum+I9f0Waa70y9cCdCkqls5GMVSaE4zidJ8M9Hk8f/GlNPWIYurzY6kfd5zX0BrHw28HfEj9o+68LaVC9lHYWyLLLGAFLqg/qK+avhv41k+HnxDt/FiQGfy38yRF45r2r4TfGDS7HVr7V7h1Gp6tdAhz1QFjx+RoVK6F7WSMGGL4p/CHx5rb6LcTXmnWNyyquScqDX0z8I/2lPDXjf7PpPiYf2RrP3QZ/lDn8a4P4+a9Y+G9BsBpc0dxqGrMJGC853VD4o+HfgzWPhRpOr3Vwnh7xKkfmKRwZD1HpXNUoX2N6eKa3PsS2k8yIv5iyKT8rKc5FT18UfBX476z4H1k+F/H/wBomsZ7kxW97JnC+hz6V9mWOo2epWEd7Y3CTQSLuV0OQa5ZQcdD0KVZTVy3R3xSA5XJpe9ZvQ3EJpR0o+tFJIBDRSk4oobGgoopM1YhaxvEmuWHhvQLnXdTmEdtaIXck4rVeQKcHv3r4v8A2tvi0114g0z4c6IzkSS4v3Q8bD0/WqhFykkY1KiSseY/EX4i3vxx+MFp4f1a9l07wu0oSGXO1W5xXGfEv4H6r8N/EcMMdu91pt0A1vdKMq4PTmvpXUfg3oGofBHSLbR0SW7ghFx9vi52kdjisPS/iMdE8FPpXxP0w6jZWR22s7DkYPHP4CvWo0ElqebWq9j5y8FeJvEXwO8fpqM+n3UdteLgoR8rKTU3iL4h65r2p62miXssGgansKwSt92TOXwPrTvid4/l8d+N4XgiiGlw8QIFHyjNY+geEtW8T/bJbC3dLazBdnUfLW05JaI5U29zJFnDaBIJBLqV6Vwqr82DVyLw34g1PVLPT3tGs55WARCME171+yx4N8La14mu9Q168tmkticCZgBkfWovjfpp8N/FhPFWl6tbSWtu4ZIItuOPpXHUmkax3KHjD9nSz8GfBtvGPirWGgvBHuSIHk8Z9K+b9FtEv9WbfL+7PKknqO1fUXi39pyx8e/D8+HtY8NtOVTaG5weMelfOMunTSX3n6dC8SOTtUL09q5KldXR6OFSV7lK6s4dP15WaUmMN8xHpX0Lpf7PkXjj4THxj4L14XE0abpLPdluOvGK8Ji0u8tb37RqFvLIqnJUr1FfQXgX9o/SPhp4ZNnp+gONyYYZOD+Fb0ppkV1fY8U0jw34ovNS1C0t9GlL6cpa5QryQODWRbXFjbambYJNbagj5EbcYOa+lPg34rs/F3xiufE91qNrZWl65Etq4UBgTnBrR/ac+EHhq11Kz8Y+F7myV5T8yQup549K6edI4HF9Tw608W6gfGmlal4tkea0sSCqMc8CvYvDkmtftA/GJpnjeHQdNjVkYcKAFzz+VeI+KPDOveGNOtNZ1y0eexuwAsgHC5rd+F/xK1D4a6+J7VzNpN+hWeJeOMY6/jT+IykrH078YY/A0fg+LR7+whjgjtglvfxAZM46jP0rhvgJ8fbvwXr8fgrxiky6dK+y1uJenJ45NSeGNF074nail42oi20JLkypBK+47/xrv/iL8O9A8X/De7j0rTbe1vdKiLxXQO0ttGf6VnUoNm1CqoqzPqO1uI7u0iurd1eGVQ6Mp6g1Yr5C/ZM+NU+pwy+BPE9zm9t5TDDJI3UDoK+uVk3SMuOnT3rzZxaPYpTUldDxS0gzjJ60ZrK9jUD1oo60VDTYxaQ9OKWmSuEjLFtvvWwjgfix40/4QX4Uavrszqs8cLeUvvjivjb4J+DLr4u2vib4ga0WubvpDDnLDLYyPzrvP2wPGIv/ABtoPw4t7ryxejdOwP3Ruxz+dcFpem/Fb4BeLLWbwmTqWhX0KNKqLuVuM44FdVGDumjza7XMdL4S8ReO/hF4tn8PyW7614f5M0LDcY179eK8r+MXxVi+Inir+zNJsV0/SoyQ8YAHI69K9M+JXx00608Fagp0H7Hr+oxlC7A/KSMd6+VNOMsSvdTxs88xZ39816baicMtS/8A2Nq0+iyXmhWG60gbElww4FfY3wCi+Htp+zRJDr2tWEF/ftIk56MBnj+dVPhP8MfD3jL9kO7tvtSWs92DO0uRleCMV87eIvC2naV4jTwd4UuZrnZhXKOTlu/euWpOxrTp3LXj3Q/D/h3xNJpfw61vVLmSaTLtaTYBrr/AfwO8aeOJIftz3htWxk3Lbm98mvYPgV+zXaW9nB4h1uJ/tBwcSZJP519X2OlWOkWK22n2scSKOABXn1ql9Tup4Y8B8O/speGNKskN80ckmMtgdKyPHvw++GHgNbGN7MO7SfNgD1r6gzmP5/Tmvlf4vz/2h4weKZGaOI/KMV5WKxChax6eEwsZNnpOifCr4U+LdAiu7TTY3DIN2AMj9K53Xf2TPBGp2kkdriJmzjI/+tS/AjxPDBNc6VeOYgfuFule/ptxleh5z61vh8XdEVqCi7H51fET9l/xd4Kknu/DBuZUQFkWA4LfSvJvDOuvZeKY9H+Iuq6xHAsgDxzS5Cc1+tdxFDcLtmiVx/tDNfMvx9/Zm0TxNplz4g8O26217tLSog+99K7VW5tTz6lIm1nTPAHjT9l2+0uw1fT7yFLbNtIxy8bYGK+FZ9I1XwpprNqVu0+mvIUW4QZAGcU/w1P/AMK4+LFtpPim3ul0wz7JUaVwpHTpmvsrw78LPDGrfs36zp9rfQalG4a5glYgtH1bb+td1KomcNSnbY+S/DHiS68O6tZm01SU6UZfNdAx4zXpHjn4m694o1S10zwBqUsdvKgjnVSeegPSvGLZJNO1m80WbAaKQqgYdRXvH7M9v4ff4gTRazFD9oCExROeGOOK61Pm0MOWzucn/wAK8+IvgS5t/Glhpdysds4uJLhRw57ivvn4OfEux+KPw1stat2RLxFCXEQ6ow4/pXz1YfFTxS/x71bwP4wES+GpYmjsrQICA3POcZ6Vxv7NXjw+BPjnq3he+BW0vrhhCrHAXJ4x+defiIanoYWpZ2PvxRJuJYgjtilPNCsGUOpyCMikB46V51TRHpoMkECig9RRSUgsPqvezRW1hLPOBsjUsc+1WK5n4gX6aZ8NdYvXOBHbtz9eK3REnZH5v+MvGmnat+114j8VeIYZ73SraUwQLHk7OB0/KvrLSviX8O/GXw4XSfC2qxx6nb2wZYLpSSpx0yQPSvnP9n/UfBUvizWrTxlBCxvLoujy9PTHNe3/ABL8G+DvCnwlv/Fmj+Gre4Y52TwFvlGeOhr1cPDRankV6iufHXxAutd1jx/cRayImMbnYY8Yr0X9n34Zr8QvFuqNOQ8em2rsY+uSykL+teMm6F091fhWWWWTaiE/dzX0P+zl4zj+DWvapD4ktGM2sW0bWsmPvkZYirndJswjZvU5LVbr4j/Dv4fQaT58umQSSFPKJwSuT6V6d+y78KZdZ8Xf8JZqgM8ed5Mgzk15n8T/ABrq3xY+L9np32crbLIEEYGAOa++/hD4RTwh8ObKy2Ksjxhjge1edVm2d+HjrY7yONIYxFFEERRgBRgClPSlzximmuCrI9JIq30jR2rMteIatoL+KvE88cSxBkPO7Fe4XZh8opMwUH1r54u7a5/4T/UTZ3LxbPm4PXrXi4mMpM66E+RaEDaFceFfE8cUyxpvI5GOea+kLL5tPgOesa/yrwmfSbfUbTS9V1WZiZJxEcnp3zXuNvcwR2cEcLqwCKBz2xW2FVtzOtPmepcZMqQKrTkRQbJl3o3BzVoMCM5qAg7vnYsPQ16Sdlocs0fIn7V/wEh1/RJ/GGiWQ3WkZmkWMYJr5v8AgT4n8XT6zc+DrPWHj8zKfZ3Y/lX6ganaRalpVxp0oBjnQoQelflP8VtCuvhN+0fNcacGhlWfzEkHGec4rppVEnocVSB6X8WvgtqPhn4S6l45ukMd/bSE4A6jj/GvGNI124trmz8QaddywXiAZCkjmvp7xF8cH8cfswXuiatpO2/kh2JIATvPHNfL2lQSaZNPpWpoyTSruiZhgjivWoSTVzinY+vPDkHhmz+GVn8WPHMj3N2X8uJEBJ3Y79fWuZ+KNh4Qn0LQPil4QR7aZZQ0iYwfvfT2qj8DfGOs3ulDwjc6NDrMELlgk+cenau6+JHgPxT4r8EO1umnaPYW/wA32WKQ/wAjV1abauKjOzsfTXwy8SR+K/hjpero4YvCqtz3AGa67FfMH7IfiWabTNV8JXEgY2BypznPOK+oMcV41aGp7VKV4idqKXtRWLRpcM15x8dZlT4BeJWMmwC3Hzf8CFej44ryz4/kD9n/AMTh87fs4zj/AHq3pa7mNZ2R8a/BHwl4N8d6Jc2uswXljf7yIbyNWK57dBXoXj3wl47+Hnwk1OyuPEcGpaGyExxyMN2O3BOfSsH9lTxdqGk+HbuLUbnT30/ef+Pk4ZRz0q9+0Tqnw/1jQJriz8WzNe7ci0ikBjJ9K9yhDRM8Os9T5HgeT+w0vZxh1uQ2F9K/QLwx4E8BeNvg74e8dak8UUmm2z8uQMkJjFfCGkxxTQWO6IJHcTCLB9z1r6Rsvh749n0u28EWWp3baHJA10ZlP3crux+lOvF20Cm1fVHCfDWez1/9pifyEAtkucIV54Br9LrJFi0y3jTOFjUDP0r8zf2erdNK/aCGlghmt7sJI56nnrX6cJjy0/u7Rg141bRHp4dEmeK5zxj4ii8OeHJb6RgpA+WuhYEcLyO+a+efj94uS41Oy8G2DI8zODKQeQDivMqPWx2zlZXO38A+Jbrx0JpJ9yRx5wfWtLXvBUMdtcXtkM3DKcmrXw70qw0TwbaW9sytI0YaRu+a6mZ0lt5CpBGDWE4cyEqulzzrwx4Ul1Lw3Db6k+0Qzb8fhW94k0vUbbTZLrSGJ8qPhc9cCpvDszS3F3iQEKxAUVsvqFtb4t5nHz8c1dKCS1MvbX3PJ/hX8Wm8Q+KLrwpqoMd3ExC7uCe1eyMw3Yz0r5T+MWkTeBPiRb+PtCYI4cO0cXQ896+hfBviuz8X+B7PXbGRZGkVRKoOdp71pF30BO+h0cz7RuAyRXxV+3P4JspPD1n4vsISLoN+8IGO9faspCncpGMZB96+ef2vLUS/AuWaR9/lnJBremjKqeR/sxReEPiP8OZ/DmqvAurRRgxqxAJ5FecftKaZY+H/ANoa20+yt1SCGHBKdCdorL/Zr8G3viu78Q6j4avpdP1eysBNamE43Pu6VS+J2i+NFOkeKPGLub65d0ZH9Fbbn9K9fDbHn1Nzuv2efE0eh+ONQmdMmdDHGCO9ReIbj4x634l1KCwt9SawMhxgNjFZ3wYu9PsfjFpsl5Cr27kZB6A817D48+O/xM8L+P8AUNO8NaLbvpke3a2w+ld9W/JoZUviMv8AZKur7RPjJqGh6nE8N3MmXV+p5r7or4F+BPibVfEX7UMXiTV4Ut7qf5XiQYHfmvvkcivGrLU9ui9APSig9KK5WbCA5Fef/GO2N38GtfgEQkL2+ApOM816Aq471ieK9Lj1XwjqFlJkrJEwI/CtaDtuY103HQ/HlbjUtNuL2ya6mtk8xvkikOOvtXRaB4F1fxPpVzewBpooU3MzSZb8q7Lw98NofF/7RGoeDy32U+acF+Aea+j9A+AWi/D9tSvbvXruRLaBvMt4X4bIIHGPWvocNKPKeHXVnc+Jwbg+HkkVSjWUwwPcV9ufDb49eHbf9n1o7pV/tmK3MSBl5fK4HNfGOo28kOranbW4k8mOYsqy9WHvX0p8Gvh34O+Kfgu02TyWWr2bgyQwkKrjI6j8KK0eZaipzSPCvhl4hu/Dn7RBvtRQxNe3fmDcMcE1+rum3Md1otnPGwZZIUYEHPVRX5mftQ6DB4E+O2lXOmIixxQ5ZT7N1r7o/Z48YweMvgbpt6kweeMFHQHlccCvCxEeh62Fmmz0+9adNOna3XMgQ7B718a3Wna7D8VNS8R+IdPuJWViI/lJGBnFfWOoauIdWitxPtY9Vz1qzOum3Ue27tYZM9Qy9a8mq9T0p4eUony7a/FfVrC2mYRTQpnCqwIxXTeFvjzYQTjS9XZgZB/rG6c17U3hjwZfgpLoOnyeoeMVw3jv4FeFvFOjZ0i2i027hy0ZhG0E+9Zxkr6HLUw80rGPb/EbRNEuLqZL5WEuSADXF6t8YEkuy0twQmflIrM0z9nzXRrCnWtRKxBsBVJ5Fes/8Ku+H3h21t11OxivJSv/AC0APNVzomOEmeVX/jKPxBp5S4sJr6JhgYUmum/Z3XWfDF/e+HNSikW0mYyx7h90HJA/WvTPDWg6LBdvJaaTbQWi9NqYFbd1eaVZBZraztvtBbGcdqXOo6myws0bcs0ZiEIzuB4r56/a/wBRis/2fLmJz88jhBn3Ne8rq9mRG8qoJT0Ar47/AG4fF9nL4ctPDmnyB5pJFeVSc7cHtXXRfNsc9aLjueJ/s4eK7z4Z+N7fX5Y5G0oRg3zL0CZ7/jXbftRfFDQvGviDQYNDRRaxozZUYHJBrV/Zf8KaX49+G/jHwtdiL7Te2AgRnH3DvByPyrjPj14U8NeBPE1j4Y04faLiNNrucEg8V7OHi0eZVaKfwmMSfFTS5bpd1vkGvrW1+IHw7m8WXmi6npKMWeNDIy+30r5f+C/hWTxF41tLSa5ltbeE7zKhw2K+i7/4X/DfxKt9b+H/ABfep4hnTdCksowXUY7D1rvqu0DGn8Ry1jDo+nfttwQ+Hogno/AG4k5r7QX7g+lfBHwV0XV1/aRew13UTdXGnt5DlCTgqSO9fe68Io9q8ev8R7WHaaFPSiiiuZnQNBOaZKu9GUjIIIp9I33CBShLUU43R+ePxonuvhh+2TpOuLbva2M8geWZRgFdwzXtifFmz8Uai6eEtHuNVW6XZI2wkEjr61N+2f8P4/EfwRbxPbW8kmqaXyoj6FOSc1yX7PV+uufstCDwjqOn6T4ghbM0si4ccjPT8a9nC4hLQ8bFUup4D8ZLDXdC8byX194ZmsLSc8sYyF5/Csz4TeLfFHhP4iw3PhVyxn6x54Ne+fHTxl4T1P4ML4f17Xjf+IoeGkR+Cea+RLXUdQ05rO/0KeX7VaOHzGcZA7Gu+V2tTiSPo/4neBPEvxZ0rWvF2qW8kMul6fJKwK9cc1lfsefGJvB2sy+HNakKWtwwjjDnHOea9h8A/tDeEPHHwQ1fSNcW20zW5bF4JUVNokJXHSvkLxD4I8UaDpsPxA0yEyWcd04QxD5QA3UivIxNNu7sehh6kYWuz9J/ExjfxbaataXQaFwGwDWL4k8U6kni6xhtUcW54c9q8I+Bfxf0Lx7dWOleKdYNpcoAqBW2jPvX1ze+GNOudGQQhJCBuSVepHbmvm69ObkfUUMZT5Vc5i7v9Th122S0DMjqCcVqWmu3WRGEdpskEAVJpWqaJaKwvLmIXcQ2bWqWxhs5NaN/b3SKjdieK5eSSZs8RTkmYd5rF8viJGu4JBApyeDVLxLKmq6lBcwOWiXoBXe6hpVnq9lMDPl9pGYzjFedaRc6Jpd5NbXt03nW7HIkORgmtOVmca9Pqa2neJIpIJNKSMxuoxnpWRHBqFwHuTuKoxx+dGr+JvAaXSSwaikdzJw+04xXZQzafY6FHuZJbZ13mQdh1qHCTZnVxNNr3TzUeI5LLWXfUH2RRqSC3FfDfxW8VJ47+PzWqSb4XnESnPA5xXtn7SPxj0S1ujoPg9/Ovj8shJzivA9J+G/iGz8PQ/EbUV2Wa3KSFiOc7vWvawNJ31PFxNVM9mi0Lxh8CtasJNAhlkbVYA25BkAHnmvFvEV7ret/EO51rX3aWcN0btX0x4r/am8FD4aWVhpmkpea6tksCSXSh1RsdRXyxNcXd9c3GsXJkM87lnQH5R9BX0tGF1qjx5yVz6H+Btj4g06/wD+Eq07TWvIV4aFBksPp+NdT4j+IFn4U+KUGpv4WvbN7KJizGNgCThq88+G/wAdrfwN4XTTbWKeGWRgGldvu16j4y+LGneNPAOt299aWLyxmNLeZU/eNuXnJ781OJnyIqirsufs2QL4m+K+ueLhbOq3UzXO5geNxzX190rw/wDZn8MjRvhkl+yOslyP4vTg8V7hXiVJps9uhG0RaKQ0Vg5am9iHeQcEmkM6jOeK5/xD4kg0GdZbpgkA++xqbTtb0zXrAXWk30Mid+c15jruLZpZMy/GOqacdPl0LVjC9vqcbQoHPXPGK/N/4k+GvFXwZ+I1/aafdz2dhfuWiVThSCc17n+2F8Qr7QvHPhyx0l5IXs3Dna/Bw2ea3vEWjaL+0x8BE1BFLeJNKtwV8ptu4gd/yrsw2MvJXPIxS11PnPwR8L7/AOIesqx8+5lkGWbkisbxv8PvEPwr8VyW+o2Lx2Mh/wBcy8AV63+zj8StR+G/iO80LxgLOCCHI+eLEnH+1Vv9p34q6X460y0/4RmW2lsSxS7WVNznHTae3NfX06jk1ZaW3PMkkup4V4b1TSfD3jqC61W0Z9Nul2tIg45Nfa3hi0+HviL9nDVNI0bUrO48xGkEEjjch69K+EbOMwWaQX0Uj2o+5v5xVixWbTtTSe11bULOxkbEgt5iox+FZ1YKSCn8Rqar8LPEnh/Srnxh4egnY2kpYmEE4A57V7Z8Hf2wLzSLaz0bxfHIyOPL3Pn5ccV7H8A7bwr/AMIFd6XfeJLK/wBLvoyHguOZQSP7xr5n8U/BvTtR+NOu+HtF1O1WFmDWiYycsTwDXk1cLzS2O5TajufVOnweGviFqUmtaV4ltojK27yvNAxXWp4G1m2WNLbU/NXsytmvzs174e/Er4SeKFsJrzUbGR/mil84lCPoK67Tv2h/jt4OsEiluYbm1TpLLASfzNck8LrosXGq0rXP0H0bRNV0u6xd3JYMPWsXVPh8NT12a680Ik3Vs+lfGMX7ZXxMlgV7yC0ujjAEMYUj9ayNf/aV+MWr2sa6ZG8LyZA8tCQB+FT7KK0sTOcnsz6K8beD/AAt4evZJbjWIzInO3fXmHjr9pQvop8KeHCzOqeWXH5V4rp9h468fa0Y7/U7+bUJD88YZgM/StvXfhNrXgG7srzxGscKzMCGbG7Ge9bU8L1aIVRx3Zzen+Bde1S5uPFF/HJndvMkmcdfWvsXS3+H17+yvY6RruqWkbKCzR7xkkGrtxZfDfXf2ZYfD0uq21jLPAN80bhZN2PUc18V+JNDsDrBs9E1jUX0+FioWSctnHWvQoUbao5qs3PqP8RL4cuPGsyaLCDbwkqjjocGum8D+Ebzxpqq6bp2GkJwVFcV5a20JtraEbF/jH3ifrXU/CfxheeBPiTa6vFJtRm/eK/IxXpLRXOR3T1O4+K3wK1vwtpNlM8B8g4M0ij7vHesL4deHdU8QeKBpKl2iaeMtjnIFe7/Ff42ab46+Gl1puk7RO6bHBGTn2qb4R+EW+HvwruvH3icKtwyboM8DoccV4mYYm0ddzvoO2p714L8VaTpt5a+CLVlE1vGFYDrnpXpiPuUGvzk8GfF65H7QbeJJJQYZptrZ6Yz2r75s/EmnyaDb6s19Clq6Bjk5NfPwxWp69GtFqyOkJzRXPaJ4r07X76WHTX3rH1fsaK61VUtTpsZ/xH8J/8Jb4GvtOtzsumjPlsOucV+dE/xN8f/Bfx1e+Hbm4mKiQ4BJ9a/UKVXRgae1LAfhXxR+2j8KVMsHjnSrM56Tt1yfp+Nc1ejdcxhXk0rxPlzx34+1n4ieIP7Y1VtxHqa7f4CfGO8+GPjyKGcGTTrtgkqE8YP/AOsLxjikSAvI+IyeVrqPDXh6fVp0nb91br/E1ckbx1R5Upyb1PrL9oX4Ijx14eHxM8APvMsXmSxQ9x3PFfGUU80EcenXaSJLBMRKH+tfSXgL9ou5+F+o2nhW9f7bo2RG6yDcfvPXk11Hxe+DHh74h+E5PiH8LvK+cebdWaYLOevp65r3cDjZSilfUwnOzPNoPD3hjxJ8HrUaaYzfhQCB1zivItY0rUPDgWwuoyok7kdqfoU/ibwXqOx5ZLQRNn7PMM5/OvWNGv/DPxFu0Ov3UVvdKhVUK8E4xXoxxLbuUoJpM8Rt1v47aQaPrEqMo3BVfNevfB7xf4B0vW7e88cNLDPG+fPY9cfU1yWseBprPxnNpelXIuHXLp5Qx+dYt4jafNJFq+mC4mHysQnK4rrnVjUJufV/xz+KXwl8e+BIm0u9SbVrbAhnGM4B6Vu/CHSvCPjv4TnS/G/h+3EpUrHcMuOPXNfFdvotretJLZqIB1APUVsR6x4206A2Nv4plih6KsZIx+tNYZPXqF3cX4qeA9I+H/wAeU0rSbyNtMnmxkNkICa+2vh18NvAGifCm3vdNay1i9ELSByQx3MM449K+Ar/w7qF5qBvLzUZruUnJeVyT+tb+j3PivRlCaR4nu7WP/nkZWIrSnhYp3K5mexeG/G9v4E+PF7rfi+1jtLFZSUXGBjPvXTfGf4pfBr4jaGlwzPJPg+Xtx1H41886sl/rLiTW78XbDuw61RhsYIZBJbwxkL2KZFP2EY3HHU9f8JeE9E1TwvJq15cCG25+zI3Vq49rD7ReSLbL+7Q8H3rpbTw1rGqWTT2Fq3lqOEHAqpo9laW7GK+g/epkMG4Oa4Z1nF7iU2g0bQIpvC97eTygSw5OB1NZdpBcXNndKGYqB8v5Vp6iBBLLb2Tugn4dF5rsfhr8KtR8Za9b24jKWdu29524UDqaipjLQdtyuXqbfwG+GcvirxFHc6kpFmrFiW6YFd/8AtUfEqOG2h8B6E4W1gGx/LPpTfip8W9O+GFrB4S8BhJbgLtknU5IPevLGisfiJpz6kZimqAbnRjy/vj2r5bF4ic5WvoS5a2PPbadrWOPyoQyncWGK9P0Xx/4q1nSbfRkvJfK3BSN1eZ3NvPYyvaTxFJAeh71618E/Dsmu+NrS3kRjCjhj9a5YxN6PNfQ+2fgl4bm0fwPDc3mTNMgyTXorruUil0uzisNJt7SIYjjRRj8KK9WnSSirntxuNBIOD1rG8V6Vb6v4M1HT5wCGhYY/CtgZzz0rO1/ULTR/Ct/qF822KOMk/lit6bSlsTUV4s/IXxB4atPDH7ROr+HhJ9mUykg5x3r3vwt8FtO8GaFN4v8WXccltHbM9rFnknHGa+e/jV8R4fEP7SNzr2gWbXFrHLg4XO8DqK6bx18bdY8eabp+iWNtNZafAoW6iGfmA7AV6lDDqSTueVWfKtD531u1bWvHWoX1qfKha4Y4B6819DfBHxn4x8I+B76P+0Z4dHihcwRk8E44xXl3ivwtNpes2j6faSf6SR5UZ616j4q8SXPg7wVZeD001pbyWPMuAcDPXNPEK0rIxp6s8a8O67N/wsK71m8/f3DTE/N1zmvqP4W/H+w0r4paRqXiGziFtEQj7l4A6ZryrwH8EvEnju8W50ewljikOWd1OPzr1zxl+x14v0/wWuo2OpxSXsSbngQ81eGqqKszSSvLQ7r9tXwlo/iPwNbfFDw1sNusS+aYj14zmvmn4G6dffEiG88J3tzKLdVL25DcA/4Vq+Evib4q0zw1rXw08WSyyQTQmFFc5KkccVT/Zf1m48FfGk+H7+MiKeXyw7DGBmvQqQU4XRnJ2lYwNQ8Ia1o3jy48PS3U5vIpSnDk8Zr13w98DPGHjvTJbb+0p7G5tl3I+/GcV9Jav+zpp+sfGeDxvBcKIGcStg9/Svb9K8GaXpWrG/tcAmPyyAOMeleRVnKGyPUoYdQimz8pNa+C3j7w1e3FnqF7ctFESN/mkg/StL4f+CvFV9qg0zTNWl+0H5lDP8AyFfop8S/gvo/i6C6uLO3C3TKWzjqa8F8DfA/W/AfxIj1vxGwhs1cmN5TgEV5lTE1Xud8IRtsY1r8G/iXpukf2tqmt3CpHyUMpxgfjXFeL/idrmg6XJo0V7MbpeDJuJ617/8AtB/tMeGrHw6PCngmQanrs6+UqW/zbc8V8w3Xwk+Jfi1f7Z1GzktrqX5gkhwcH2rowspVNJHNiFGOiOP0zV/EWt63DBLqNzLNO2FUyE5r1vx38GPGvgf4c2ni+71W5aK4ALRbz8vGazPhb8Ltc0z4z2Om67ZPF5EqtIxHBAr75+Nvgq18W/Bu70c26iOKPzEAHTArsq00jiVVrY/MLTdQn1K1t7ieRpZSQvPtXZaXr2o+EdfhvLK5lhWdAJIwxAbisrw/4Q1q21zUNPktXEVlMSpxwR2rq5vA+ueKLiG30+0kdozt3AcA1wYhOMHY2jP3lqeefEPWpNZ8T/ANp+a7K6/dY9M13/AMB/hbfeM/EsOo3u+PT1+ZmYYzX1f4C/Yd8OyeFrXUfFN1I946hpFzwK+gPB3wn8PeDNBk0/SrfCqvD45rz4UKlXWR6sJQhHQ8i+Hvwt0O01aGS2s0kt7Y5j46kdzX0FDbQ2dsqW8IjRRxjtWZ4b8M2+jW1yYwd8jk5rXl+4QeTXo0KSgehRp2jdlm3O5M9jRUtsu2EUV1M3SFwB2rj/ihpdvrHw71OyuVDJJEeD9K61m+U1l61Gtz4dv4ZlyhiOc/StIStJEVFeNj8W/Cnh2z079pa80u+RbiLz8hXGe9fY/in4N/De68L3erf2WllfRxM6SwHaVI55xXxv8AEjXL3wV+09qepacg/dzcblz1rvPE/wC0z4q8VeDY9DsrCK0YDbLLECNw78V9NQqRULHzFelKU00ed6rrN9ceLpIpbqa4ghkKo8jkk4OK+jPgT8M7L4l+N4tY1g/aLGwAYQsflz6AV83aKZZtXjlnG7zGDMxHfNfaXwK+I/gH4e+D5ZNY121h1GbkxucEccVE2pKyFCDi7s+ptQ8K6Lp+irdaLpVvbywqNrKgGRXmPjnxJqD+D7y1uIysqqQR7Vb8E/tF+CPGd7Lo9hqdvJcnO0I/X0qh440PVdUhu47a0laOQHB9a8bEqUVa56dPlaufCPgfw3f6/8ftRvtPjJit7jfIVXjrX098VfgdZ+ONPsvEuhgWuvWgV45V43Y7GuH+D2jxeFfiNqVrq0Zt9SkmOxXHUV9X6MGe1iVvm+XkCuWWMnDRM6KeGhPVo+bPD/AMevEPwn1GHQ/i5pksY+7DfqnB7DNfUXhTxr4e8baDFrnhrUYbyzZfm2HJQ46GuA+NPwX0f4qeDptGvoVWVATDMByp/wr4J8G/FLxp+yf8TL3wvqkE15ozSEBCTtYZ6j3qoYmVTfc0lQVJe6fq7bSCS1kU4z7V85/tN/Euz+HfhOa5tWQ6mVKwJnkseBUehftffB658Ep4h1LxJBp0vlh2tJyRJnH3QPWvhL43/HS7+M/xJW6s45YtKtSfskJ6tz94/jVypuS1M/auJ65+zl8Kta+KXxBf4j+OWla1WUzRrL/ABMTnAr7zntLa00m58pUjhSLYFAwOnpXjH7Jmt2d98EtPS2dBNESkqjqDXp/irW4bPRb22EoaZl+UZ6V0UowpxMKnNUZ8n/s9+HNP1T9pjxFf3qLJJbzHywRnA9q+y9f0221Xw3dae0eEkjIAFfAnwA+JWi+CP2mNeTxLdLa213MdjyHABBr6F8fftXfB3w34WvNSs/FNpqF1HGTHa2zb3duwA+tY1q3M7G9Okox1PjzWvDlhp/7R93pd0gFu1z8wYZBGa+xtV+Cfw5vvBNzrWk6cttfRw70mgOw5x6CvhjVvGuseNPidd+LJYjA1xPviQdh2r6d0P9pjxRfeC4vD1npdtPcsgjadkPA96ynqkmRCNpXPPNQ13UdF8WTaWtxLcwxvtw7k98V9HfC74eeE7rT4Nae1Nxd8NlzkKa8MtfDVzc6hPrGoybp5mLsB0yTXv3w98c+EvDXhuCy1DXbWCVFAId8V5lW0dUerTXU99sJ0it1hjG1AMACsXxV4mi8PabJezOML0FZHh/xvoPiS7aHSNUt7rZ1Eb5/OsH4teH9S1zQZILRS46lRXHWxFoe6ehQS5tS38PvjBa+M7+fT84mQnbXpS/OmTXw18L9Zl8DeP5m1i3ltI1fBdxxX1Zp3xe8BXtqkyeI7IZHRpACP1qMHjbx986q1JRkkei24+TBormtI8c+FtQk2WuvWMjdlEozRXpqvFnJys6U5xkVRvl36ZdLtyTEw/StDORVC73DT7kocP5TY+uK1T1REtj8Z/jZ4Fvtf+MOq31tK6PBO2Ao5PNM0r4V3934f826muIpAOgU817n438Oa/a/GrVZotPa4Se4Yrjp1rsPC/hPxZ/Z6m/0+KBcfKpHNddTEVI7M5lh6T1Z8qWHw5v8ATvEUF9K7vDE3cHNekT/Dq+8Z28Ntb3VxDEcbmCngV7ePAWqT6r/pG3yM9BXo1h4Pj0jSA1vCvmhc81xTx1W+5rHC0vI8D+H37IuhaNqkWsarfXU0kbb1G3bzXvfiv4b2d94ctNOtI9vk4+bua0tN1a+j1mGyvYMRscA9q7G6mRLdi/CgZzWTrTnuzaNKMPhPB9Y+C9ne6PbrGPLuYMbHA5r0LwboV1p+lW1rqEpeWIDnFTeG9duNX8Q3sD4W0tjhfUmtzUtQWykS4yCvoOprOcpM2goxdxLwJbWz3DKPLQdMV8T/ALV0Hgr4ieGZbC40oXOowtiKaNcOD9a+r/Eut2svhyZluVjJXpu5r8/Pir458TeE/EM8Vro0moWdw2YZohux9a6MLF3sc2JqRseD6b+x/wDFDxPdtc29xHp1gW+U3Ehzj6CvY/hr+w9oegaomoeL9ZOpzLyIo1IXP1rS+GnxX+J/iXVYtPs/Cc09s7gM78ACvtfwJp2rQ6NHJrNtDFOQPlVea76vMkcMZX1RxvhzwjYeGtCjsNLtVt7eJcKgHQV4P+0bZ3qaf9shd1Ebg8V9i3luphI/SvFvi94dttW8P3Fq6A5Ukce1cDrST1PQpQptWZ8g2fw71TxFodr4g09nF3Ad4KjnIrpNA/Z68c+Ob9JPE2t3kdpnPl7TzXsHwP8Ja3b3E9je25/s5WOwkV7/C0OkWzNIVjRRz7CsqmJmnoNYam3qjybwB+zx4E8D2o+y6f9svQP3k8w3MTXR+NfhtZX+l21lp6eRGh5wK7jw1r39tCdoFxDGcBu1Xb+7trS1+1XUyKijgE1n9ZqPqafV6a6HjOp/Bez1Hw3a23m+XcxD7+OtdJ4L8CXWj2FvbanP5vlgbcDGK0NE8T3HiHxJLDb4SwhO0H+9XTeINTj0e0e9lZdkS9+9ZyrzkrNmkaEIu6Rw/xN0jTtG8JX+pW8CxXCpkSKOa+Q5fil8SreU29h4evdStc4BwSCK9X+LvxR13xXp11ouhaFdSWZHz3W0hce1eIeF/jT458G3w0jUvCkskKnCSgc4rqw9NSV2c1apKD0R6F4b8V+L9e1iC31b4b3cED/ekKnj9K7H4rfCXVfEHhuC98H6dNb6nF8wRVxz9a9I+DHxM1Dx9ZhrrQWscDPzV7bDbqg5UEdhWc/ckXB+0Wp8D/DTwd8bLS/8AJ1+0vo7VW+bex/xr7h8PWyWWkW0Gza6oN2e5rS8sYztH0xVS5lMFvJKUAVBk4p87mS6caexfFFVLC5S8tI7iL7r9KKXvdDWMk1ckY/MKq3PFlOf+mb/yNFFAz5u1lF/tdvkX73pVq0AMm3HHpiiioqdTKnuWYVBuY1IGAwxXrPiBQPDjHHPk/wBKWisFsaw3PBb52TXbXaSPnHQ17ZfIp0WPIB/dd6KK5p7nVLZHlfgP/kYtY+tb3iFmE0IBIHtRRWVQ0pbnR3sMR8LzHYufKPOB6V8g+Lba3fxC26GM4zjKiiumhuzixWyOg+B1pbG/ZvIjz2O0V9UaWNtqgAA47CiirqbhR2Q+4Y4YZrxH4qKpvY12jBPPHWiivOqbHpYf4j0j4Z28CaHGViQHjnbXT61Gi2rYVRx6UUV51Tc9WmtDzX4eAfatRx/fNdj4nVfs7/KvT0oorkkbw3PG/h8qjUNQIGDvHIrtfFwB05cj+HvRRSqbGlL4jwLxxI6R3Ox2XPXBxXzJ4gijfXQHRW57jNFFehhDzcR8R9c/s7QRDTdwjQHjkCvf0RRtwAOe1FFVL4wh8JaPQ1Q1UkaXdEEg+WaKKzRvLYpeG2ZtLh3MT9TRRRWlzm6n/9k=";

const DEFAULT_SUBJECTS = [
  "Hindi",
  "English",
  "Urdu/Sanskrit",
  "Social Science",
  "Civics",
  "H. Science/Maths",
  "Sociology",
  "Economics",
  "History",
  "Education",
  "Drawing",
  "Science",
  "Theology",
].map((name, i) => ({ id: `s${i + 1}`, name, hy: 100, an: 100 }));

const SAMPLE_STUDENTS = [
  {
    name: "SAMPLE - Aarav Kumar",
    father: "Sample Father One",
    mother: "Sample Mother One",
    cls: "9TH",
    roll: "01",
    dob: "2011-05-14",
    sr: "S-1001",
    village: "MANI KALAN",
    post: "MANI KALAN",
    district: "JAUNPUR",
    state: "UTTAR PRADESH",
    photo: "",
    isSample: true,
    marks: {
      s1: ["40", "", "72", ""],
      s2: ["35", "", "68", ""],
      s3: ["42", "", "75", ""],
      s4: ["38", "", "70", ""],
      s5: ["45", "", "80", ""],
      s6: ["30", "", "64", ""],
    },
  },
  {
    name: "SAMPLE - Sana Khan",
    father: "Sample Father Two",
    mother: "Sample Mother Two",
    cls: "9TH",
    roll: "02",
    dob: "2011-09-02",
    sr: "S-1002",
    village: "MANI KALAN",
    post: "MANI KALAN",
    district: "JAUNPUR",
    state: "UTTAR PRADESH",
    photo: "",
    isSample: true,
    // Stage 1: Half-Yearly only (Annual and G. Total empty on card)
    marks: {
      s1: ["38", "25", "", ""],
      s2: ["35", "25", "", ""],
      s3: ["40", "30", "", ""],
      s4: ["32", "20", "", ""],
      s5: ["42", "28", "", ""],
      s6: ["30", "20", "", ""],
    },
  },
  {
    name: "SAMPLE - Rohit Yadav",
    father: "Sample Father Three",
    mother: "Sample Mother Three",
    cls: "10TH",
    roll: "01",
    dob: "2010-12-21",
    sr: "S-1003",
    village: "MANI KALAN",
    post: "MANI KALAN",
    district: "JAUNPUR",
    state: "UTTAR PRADESH",
    photo: "",
    isSample: true,
    marks: {
      s1: ["36", "", "60", ""],
      s2: ["12", "", "20", ""],
      s3: ["30", "", "58", ""],
      s4: ["34", "", "61", ""],
      s5: ["29", "", "55", ""],
      s6: ["32", "", "57", ""],
    },
  },
];

async function seedInitialData() {
  try {
    // 1. Seed admin user if no users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const email = (process.env.DEFAULT_EMAIL || "admin@school.com").toLowerCase();
      const password = process.env.DEFAULT_PASSWORD || "ChangeMe@123";
      await User.create({ email, password });
      console.log(`[Seed] Created initial admin account: ${email}`);
    }

    // 2. Seed settings if none exist
    let settings = await Settings.findOne({ key: "global" });
    if (!settings) {
      settings = await Settings.create({
        key: "global",
        school: {
          name: "Dr. WAKEEL NAZEER INTER COLLEGE",
          addr: "MANI KALAN, JAUNPUR (U.P.)",
          title: "PROGRESS REPORT CARD",
          session: "2026-27",
          pass: 33,
          logo: DEFAULT_LOGO,
        },
        subjects: DEFAULT_SUBJECTS,
      });
      console.log("[Seed] Created default school and subjects settings.");
    }

    // 3. Seed sample students if no students exist
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.insertMany(SAMPLE_STUDENTS);
      console.log("[Seed] Created 3 sample students.");
    }
  } catch (err) {
    console.error("[Seed] Error during seeding:", err.message);
  }
}

module.exports = seedInitialData;

