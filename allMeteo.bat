for /l %%x in (1, 1, 12) do (
    for /l %%y in (1, 1, 31) do (
        call babel-node getMeteo.js %%x %%y
    )
)
