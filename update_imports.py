import os

root = '/home/lshdainty/study/porest-hr-front/src'
count = 0
for dirpath, dirnames, filenames in os.walk(root):
    if '/components/shadcn' in dirpath or '/shared/ui/shadcn' in dirpath:
        continue
    for fn in filenames:
        if fn.endswith(('.ts', '.tsx')):
            fp = os.path.join(dirpath, fn)
            with open(fp, 'r') as f:
                content = f.read()
            if '@/components/shadcn/' in content:
                new_content = content.replace('@/components/shadcn/', '@/shared/ui/shadcn/')
                with open(fp, 'w') as f:
                    f.write(new_content)
                count += 1
print(f'Updated {count} files')
